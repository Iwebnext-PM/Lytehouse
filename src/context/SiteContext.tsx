import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_PUBLIC_SITE_PAYLOAD } from '../data/defaultSiteData';
import type { PublicSitePayload } from '../types/cms';

interface SiteContextValue {
  siteData: PublicSitePayload;
  loading: boolean;
  mapsApiKey: string;
  currentPath: string;
  navigate: (path: string) => void;
  refreshSiteData: () => Promise<void>;
  bookingOpen: boolean;
  preselectedServiceId: string | null;
  openBookingModal: (serviceId?: string) => void;
  closeBookingModal: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

function updateMetaTag(selector: string, attrName: 'name' | 'property', attrVal: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<PublicSitePayload>(DEFAULT_PUBLIC_SITE_PAYLOAD);
  const [loading, setLoading] = useState(true);
  const [mapsApiKey, setMapsApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  const refreshSiteData = useCallback(async () => {
    try {
      const res = await fetch('/api/site', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as PublicSitePayload;
        setSiteData(data);
      }
    } catch {
      // Keep default/cached data if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSiteData();
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      fetch('/api/config/maps')
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { apiKey?: string } | null) => {
          if (data?.apiKey) setMapsApiKey(data.apiKey);
        })
        .catch(() => {});
    }
  }, [refreshSiteData]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (normalized !== window.location.pathname) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openBookingModal = useCallback((serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setBookingOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setBookingOpen(false);
  }, []);

  // Sync brand colors & favicon
  useEffect(() => {
    const colors = siteData.settings.brandColors;
    const root = document.documentElement;
    root.style.setProperty('--brand-canvas', colors.canvas);
    root.style.setProperty('--brand-surface', colors.surface);
    root.style.setProperty('--brand-ink', colors.ink);
    root.style.setProperty('--brand-accent', colors.accent);
    root.style.setProperty('--brand-accent-deep', colors.accentDeep);

    if (siteData.settings.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteData.settings.faviconUrl;
    }
  }, [siteData.settings.brandColors, siteData.settings.faviconUrl]);

  // Dynamic per-page & per-article SEO metadata
  useEffect(() => {
    const cleanPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');
    let title = `${siteData.settings.businessName} – Wellness & Personal Transformation`;
    let description = siteData.settings.tagline;
    let keywords = 'wellness, mindfulness, personal development';
    let ogImage = siteData.home.hero.imageUrl;

    if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      const post = siteData.blogPosts.find((p) => p.slug === slug);
      if (post) {
        title = post.seoTitle || `${post.title} | ${siteData.settings.businessName}`;
        description = post.seoDescription || post.excerpt;
        keywords = post.seoKeywords || post.category;
        ogImage = post.featuredImageUrl || ogImage;
      }
    } else if (cleanPath === '/privacy') {
      title = `${siteData.legal.privacyPolicy.title} | ${siteData.settings.businessName}`;
      description = `Privacy Policy for ${siteData.settings.businessName}.`;
    } else if (cleanPath === '/terms') {
      title = `${siteData.legal.termsAndConditions.title} | ${siteData.settings.businessName}`;
      description = `Terms and Conditions for ${siteData.settings.businessName}.`;
    } else if (cleanPath === '/admin') {
      title = `Admin Dashboard | ${siteData.settings.businessName}`;
      description = 'Website content management and client booking portal.';
    } else {
      const match = siteData.seoPages.find((p) => p.path === cleanPath);
      if (match) {
        title = match.title;
        description = match.description;
        keywords = match.keywords;
        ogImage = match.ogImageUrl || ogImage;
      }
    }

    document.title = title;
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (ogImage) {
      const absoluteImg = ogImage.startsWith('http')
        ? ogImage
        : `${window.location.origin}${ogImage}`;
      updateMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteImg);
    }
  }, [currentPath, siteData]);

  return (
    <SiteContext.Provider
      value={{
        siteData,
        loading,
        mapsApiKey,
        currentPath,
        navigate,
        refreshSiteData,
        bookingOpen,
        preselectedServiceId,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return ctx;
}

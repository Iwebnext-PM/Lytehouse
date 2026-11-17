import { useEffect, useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteProvider, useSite } from './context/SiteContext';
import { AboutPage } from './pages/AboutPage';
import { ApproachPage } from './pages/ApproachPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppShell() {
  const { currentPath } = useSite();
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  const cleanPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');

  const quotaBanner = mapsQuotaExceeded ? (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
      <span>
        Google Maps Platform quota reached. If you are the app owner, visit{' '}
        <a
          href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-950 hover:text-amber-800"
        >
          maps developer site
        </a>{' '}
        for instructions to update your account.
      </span>
    </div>
  ) : null;

  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    return (
      <>
        {quotaBanner}
        <AdminDashboard />
      </>
    );
  }

  let pageView = <HomePage />;
  if (cleanPath === '/about') {
    pageView = <AboutPage />;
  } else if (cleanPath === '/services') {
    pageView = <ServicesPage />;
  } else if (cleanPath === '/approach') {
    pageView = <ApproachPage />;
  } else if (cleanPath === '/blog' || cleanPath.startsWith('/blog/')) {
    pageView = <BlogPage />;
  } else if (cleanPath === '/contact') {
    pageView = <ContactPage />;
  } else if (cleanPath === '/privacy') {
    pageView = <LegalPage type="privacy" />;
  } else if (cleanPath === '/terms') {
    pageView = <LegalPage type="terms" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      {quotaBanner}
      <Navbar />
      <main className="flex-1">{pageView}</main>
      <Footer />
      <BookingModal />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  );
}

import { useCallback, useEffect, useState } from 'react';
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type {
  AppointmentBooking,
  CommunicationLog,
  ContactInquiry,
  PublicSitePayload,
} from '../../types/cms';
import { AdminAuthGate } from './AdminAuthGate';
import { adminFetch, setStoredAdminToken } from './adminApi';
import {
  BlogCrudPanel,
  ContentEditorPanel,
  ServicesCrudPanel,
  TestimonialsCrudPanel,
} from './AdminContentPanels';
import {
  BookingsAndCommsPanel,
  InquiriesPanel,
  MediaLibraryPanel,
  SeoAndSettingsPanel,
} from './AdminOperationsPanels';

interface AdminDashboardData extends PublicSitePayload {
  inquiries: ContactInquiry[];
  bookings: AppointmentBooking[];
  communications: CommunicationLog[];
}

type AdminTab =
  | 'overview'
  | 'content'
  | 'services'
  | 'testimonials'
  | 'blog'
  | 'media'
  | 'bookings'
  | 'inquiries'
  | 'settings';

export function AdminDashboard() {
  const { navigate, refreshSiteData } = useSite();
  const [authLoading, setAuthLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [emailHint, setEmailHint] = useState('');
  const [tab, setTab] = useState<AdminTab>('overview');
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [toast, setToast] = useState<{ msg: string; isError?: boolean } | null>(null);

  const notify = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 3500);
  }, []);

  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const status = await adminFetch<{
        configured: boolean;
        authenticated: boolean;
        email: string;
      }>('/api/auth/status');
      setConfigured(status.configured);
      setAuthenticated(status.authenticated);
      setEmailHint(status.email);
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const payload = await adminFetch<AdminDashboardData>('/api/admin/dashboard');
      setData(payload);
      await refreshSiteData();
    } catch (err) {
      if (err instanceof Error && err.message.includes('Authentication')) {
        setAuthenticated(false);
      }
    }
  }, [refreshSiteData]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) {
      void loadDashboard();
    }
  }, [authenticated, loadDashboard]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setStoredAdminToken('');
    setAuthenticated(false);
    setData(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center text-sm text-[#5A6358]">
        Loading admin portal...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminAuthGate
        configured={configured}
        defaultEmail={emailHint}
        onAuthenticated={() => {
          setConfigured(true);
          setAuthenticated(true);
        }}
      />
    );
  }

  const unreadCount = data ? data.inquiries.filter((i) => !i.read).length : 0;
  const activeBookingsCount = data
    ? data.bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length
    : 0;

  const navItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Pages & Nav', icon: Sliders },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'blog', label: 'Blog & Articles', icon: FileText },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'bookings', label: 'Bookings & Comms', icon: CalendarCheck, count: activeBookingsCount },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, count: unreadCount },
    { id: 'settings', label: 'SEO & Settings', icon: Settings },
  ];

  const activeLabel = navItems.find((n) => n.id === tab)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1E241E] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 bg-[#FFFFFF] border-b lg:border-b-0 lg:border-r border-[#E2DDD2] flex flex-col justify-between">
        <div>
          <div className="px-5 py-5 border-b border-[#E2DDD2]">
            <p className="text-xs font-semibold text-[#5E7059]">Owner CMS</p>
            <p
              className="text-xl font-medium text-[#1E241E]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Lyte House Collective
            </p>
          </div>

          <nav aria-label="Admin Navigation" className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#3F4F3B] text-[#F8F6F1]'
                      : 'text-[#4A5349] hover:bg-[#F0ECE3] hover:text-[#1E241E]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`font-tabular text-[11px] ${
                        active ? 'text-[#D9DFD4]' : 'text-[#5E7059] font-semibold'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-[#E2DDD2] text-xs text-[#5A6358] space-y-2">
          <p className="truncate">Signed in: {emailHint}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A2727] hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="bg-[#FFFFFF] border-b border-[#E2DDD2] px-6 py-4 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#5A6358] flex items-center gap-2">
            <span>Admin</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#1E241E]">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-[#D8D2C5] text-[#1E241E] hover:bg-[#F0ECE3] whitespace-nowrap cursor-pointer"
            >
              View Live Site
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="lg:hidden px-3 py-2 rounded-lg text-xs font-medium text-[#7A2727] border border-[#E5B8B8] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {toast && (
          <div
            role="status"
            className={`mx-6 mt-4 px-4 py-3 rounded-xl text-xs font-medium border ${
              toast.isError
                ? 'bg-[#FDF2F2] border-[#E5B8B8] text-[#7A2727]'
                : 'bg-[#F0ECE3] border-[#C9D2C4] text-[#2C332B]'
            }`}
          >
            {toast.msg}
          </div>
        )}

        <main className="p-6 max-w-6xl w-full space-y-6">
          {!data ? (
            <div className="p-8 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl text-sm text-[#5A6358]">
              Loading website data...
            </div>
          ) : (
            <>
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#5A6358]">Active Services</p>
                      <p className="text-3xl font-tabular font-medium text-[#1E241E]">
                        {data.services.filter((s) => s.active).length}
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#5A6358]">Published Articles</p>
                      <p className="text-3xl font-tabular font-medium text-[#1E241E]">
                        {data.blogPosts.filter((p) => p.published).length}
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#5A6358]">Scheduled Bookings</p>
                      <p className="text-3xl font-tabular font-medium text-[#1E241E]">
                        {data.bookings.length}
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-5 space-y-1">
                      <p className="text-xs text-[#5A6358]">Unread Inquiries</p>
                      <p className="text-3xl font-tabular font-medium text-[#1E241E]">
                        {unreadCount}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-normal text-[#1E241E]">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setTab('content')}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
                      >
                        Edit Home &amp; About Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('services')}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
                      >
                        Manage Services
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('bookings')}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
                      >
                        Review Appointments
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('media')}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
                      >
                        Upload Media
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'content' && (
                <ContentEditorPanel
                  home={data.home}
                  about={data.about}
                  approach={data.approach}
                  settings={data.settings}
                  media={data.media}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'services' && (
                <ServicesCrudPanel
                  services={data.services}
                  categories={data.serviceCategories}
                  media={data.media}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'testimonials' && (
                <TestimonialsCrudPanel
                  testimonials={data.testimonials}
                  media={data.media}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'blog' && (
                <BlogCrudPanel
                  posts={data.blogPosts}
                  categories={data.blogCategories}
                  media={data.media}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'media' && (
                <MediaLibraryPanel
                  media={data.media}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'bookings' && (
                <BookingsAndCommsPanel
                  bookings={data.bookings}
                  communications={data.communications}
                  settings={data.settings}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'inquiries' && (
                <InquiriesPanel
                  inquiries={data.inquiries}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}

              {tab === 'settings' && (
                <SeoAndSettingsPanel
                  settings={data.settings}
                  seoPages={data.seoPages}
                  legal={data.legal}
                  onSaved={loadDashboard}
                  notify={notify}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

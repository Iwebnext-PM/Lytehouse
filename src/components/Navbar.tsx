import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export function Navbar() {
  const { siteData, currentPath, navigate, openBookingModal } = useSite();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = siteData.settings.navigation.filter((item) => item.enabled);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLinkClick = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2DDD2] bg-[#F8F6F1]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7059] rounded-md px-1"
        >
          {siteData.settings.logoUrl && (
            <img
              src={siteData.settings.logoUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-7 w-7 object-contain rounded"
            />
          )}
          <span
            className="text-xl md:text-2xl font-medium tracking-tight text-[#1E241E]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {siteData.settings.businessName}
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A5349]"
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7059] rounded ${
                  active ? 'text-[#1E241E] font-semibold' : 'hover:text-[#1E241E]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#5E7059] transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#F8F6F1] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5E7059]"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E2DDD2] text-[#1E241E] hover:bg-[#F0ECE3] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E2DDD2] bg-[#F8F6F1] px-4 py-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.path);
                  }}
                  className={`px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#F0ECE3] text-[#1E241E] font-semibold'
                      : 'text-[#4A5349] hover:bg-[#F0ECE3]/60 hover:text-[#1E241E]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openBookingModal();
              }}
              className="mt-3 w-full py-3 px-4 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

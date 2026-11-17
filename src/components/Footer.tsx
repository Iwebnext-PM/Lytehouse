import { Mail, Phone } from 'lucide-react';
import { formatPhoneDisplay, useSite } from '../context/SiteContext';

export function Footer() {
  const { siteData, navigate, openBookingModal } = useSite();
  const { settings, services } = siteData;

  const navLinks = settings.navigation.filter((n) => n.enabled);
  const featuredServices = services.filter((s) => s.active).slice(0, 5);
  const activeSocials = settings.socialLinks.filter((s) => s.enabled && s.url);

  return (
    <footer className="border-t border-[#E2DDD2] bg-[#F0ECE3] text-[#1E241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-block text-2xl font-medium tracking-tight text-[#1E241E]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {settings.businessName}
            </a>
            <p className="text-sm leading-relaxed text-[#5A6358] max-w-sm">
              {settings.footer.description}
            </p>
            <p className="text-xs text-[#5A6358]">{settings.footer.privacyNotice}</p>

            {activeSocials.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#3F4F3B]">
                {activeSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-[#C8C2B4] hover:decoration-[#3F4F3B] transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#5A6358]">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-[#4A5349]">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    className="hover:text-[#1E241E] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#5A6358]">Offerings</h3>
            <ul className="space-y-2.5 text-sm text-[#4A5349]">
              {featuredServices.map((srv) => (
                <li key={srv.id}>
                  <a
                    href="/services"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/services');
                    }}
                    className="hover:text-[#1E241E] transition-colors"
                  >
                    {srv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Direct Booking */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-[#5A6358]">Connect</h3>
            <div className="space-y-2.5 text-sm text-[#4A5349]">
              <a
                href={`tel:${settings.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2.5 hover:text-[#1E241E] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#5E7059] shrink-0" aria-hidden="true" />
                <span>{formatPhoneDisplay(settings.phone)}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-[#1E241E] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#5E7059] shrink-0" aria-hidden="true" />
                <span>{settings.email}</span>
              </a>
              <p className="text-xs text-[#5A6358] pt-1">{settings.location.address}</p>
            </div>

            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-[#F8F6F1] rounded-lg transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Schedule a Session
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#DED8CA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5A6358]">
          <p>{settings.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                navigate('/privacy');
              }}
              className="hover:text-[#1E241E] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigate('/terms');
              }}
              className="hover:text-[#1E241E] transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin');
              }}
              className="hover:text-[#1E241E] transition-colors"
            >
              Owner Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

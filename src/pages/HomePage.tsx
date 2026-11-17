import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { Reveal } from '../components/Reveal';
import { ServiceIcon } from '../components/ServiceIcon';
import { DEFAULT_HERO_VIDEO } from '../data/defaultSiteData';
import { formatPhoneDisplay, useSite } from '../context/SiteContext';

export function HomePage() {
  const { siteData, navigate, openBookingModal } = useSite();
  const { home, settings, services, testimonials } = siteData;
  const toggles = settings.sectionToggles;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const heroVideoSrc = home.hero.videoUrl || DEFAULT_HERO_VIDEO;

  useEffect(() => {
    setVideoFailed(false);
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.play().catch(() => {
        // Browser autoplay policy fallback handled gracefully
      });
    }
  }, [heroVideoSrc]);

  const featuredServices = services.filter((s) => s.active && s.featured).slice(0, 3);
  const displayServices =
    featuredServices.length > 0
      ? featuredServices
      : services.filter((s) => s.active).slice(0, 3);

  const activeTestimonials = testimonials.filter((t) => t.active);

  return (
    <div>
      {/* 1. Full-Width Video Hero */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden bg-gradient-to-br from-[#232B23] via-[#1E241E] to-[#2E382D]">
        <div className="absolute inset-0 w-full h-full">
          {!videoFailed && heroVideoSrc && (
            <video
              ref={videoRef}
              key={heroVideoSrc}
              src={heroVideoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#141914]/75 via-[#141914]/35 to-[#141914]/20 pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl space-y-6 text-[#F8F6F1]">
            <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D9DFD4]">
              {home.hero.eyebrow}
            </p>
            <h1
              className="font-normal tracking-tight leading-[1.06] text-[#F8F6F1]"
              style={{
                fontSize: 'clamp(2.5rem, 4.6vw, 4.25rem)',
                textWrap: 'balance',
              }}
            >
              {home.hero.headline}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#E7EAE3] max-w-xl">
              {home.hero.subheadline}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-medium bg-[#F8F6F1] text-[#1E241E] hover:bg-[#EFECE3] transition-colors cursor-pointer"
              >
                {home.hero.primaryCtaLabel}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/approach')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-medium border border-[#F8F6F1]/45 text-[#F8F6F1] hover:bg-[#F8F6F1]/10 transition-colors cursor-pointer"
              >
                {home.hero.secondaryCtaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Company Philosophy */}
      {toggles.philosophy && (
        <section className="py-20 md:py-28 border-b border-[#E2DDD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <Reveal className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                    {home.philosophy.eyebrow}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-[2.65rem] font-normal leading-[1.15] text-[#1E241E]"
                    style={{ textWrap: 'balance' }}
                  >
                    {home.philosophy.headline}
                  </h2>
                  <p className="text-base leading-relaxed text-[#4A5349] max-w-xl">
                    {home.philosophy.body}
                  </p>
                  <p className="text-base leading-relaxed text-[#5A6358] max-w-xl">
                    {home.philosophy.secondaryBody}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#3F4F3B] hover:text-[#1E241E] underline underline-offset-4 decoration-[#C8C2B4] hover:decoration-[#1E241E] transition-colors cursor-pointer"
                  >
                    {home.philosophy.ctaLabel}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-6">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-[#E2DDD2]">
                  <ResilientImage
                    src={home.philosophy.imageUrl}
                    alt={home.philosophy.imageAlt}
                    fallbackTitle="Our Philosophy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Wellness & Personal Development Services */}
      {toggles.services && (
        <section className="py-20 md:py-28 bg-[#F0ECE3]/55 border-b border-[#E2DDD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                  Guided Offerings
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-normal leading-tight text-[#1E241E]"
                  style={{ textWrap: 'balance' }}
                >
                  Supportive practices tailored to where you are today.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3F4F3B] hover:text-[#1E241E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                View All Services
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {displayServices.map((srv, idx) => (
                <Reveal
                  key={srv.id}
                  delay={idx * 0.06}
                  className="group bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#EFECE3]">
                    <ResilientImage
                      src={srv.imageUrl}
                      alt={srv.title}
                      fallbackTitle={srv.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#5A6358]">
                        <ServiceIcon name={srv.iconName} className="w-3.5 h-3.5 text-[#5E7059]" />
                        <span>{srv.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{srv.duration}</span>
                      </div>
                      <h3 className="text-2xl font-normal text-[#1E241E] leading-snug">
                        {srv.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#5A6358]">{srv.summary}</p>
                    </div>

                    <div className="pt-4 border-t border-[#EFECE3] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/services')}
                        className="text-xs font-semibold text-[#4A5349] hover:text-[#1E241E] transition-colors cursor-pointer"
                      >
                        Learn More
                      </button>
                      <button
                        type="button"
                        onClick={() => openBookingModal(srv.id)}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] transition-colors cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: 'var(--brand-accent-deep)' }}
                      >
                        {srv.ctaLabel || 'Book a Session'}
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Choose Lyte House Collective */}
      {toggles.whyChooseUs && (
        <section className="py-20 md:py-28 border-b border-[#E2DDD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <Reveal className="lg:col-span-4 space-y-4">
                <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                  {home.whyChooseUs.eyebrow}
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-normal leading-tight text-[#1E241E]"
                  style={{ textWrap: 'balance' }}
                >
                  {home.whyChooseUs.headline}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#5A6358]">
                  {home.whyChooseUs.intro}
                </p>
              </Reveal>

              <div className="lg:col-span-8 divide-y divide-[#E2DDD2] border-t border-b border-[#E2DDD2]">
                {home.whyChooseUs.items.map((item, idx) => (
                  <Reveal
                    key={item.id}
                    delay={idx * 0.05}
                    className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                  >
                    <span className="sm:col-span-2 text-sm font-tabular text-[#5E7059]">
                      {item.number}.
                    </span>
                    <div className="sm:col-span-10 space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-normal text-[#1E241E]">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-[#5A6358]">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Personal Growth & Transformation */}
      {toggles.transformation && (
        <section className="py-20 md:py-28 bg-[#222922] text-[#F8F6F1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <Reveal className="lg:col-span-6 space-y-5">
                <p className="text-xs font-semibold tracking-wider text-[#B6C4AE]">
                  {home.transformation.eyebrow}
                </p>
                <h2
                  className="text-3xl sm:text-4xl lg:text-[2.6rem] font-normal leading-[1.15] text-[#F8F6F1]"
                  style={{ textWrap: 'balance' }}
                >
                  {home.transformation.headline}
                </h2>
                <p className="text-base leading-relaxed text-[#D7DDD3] max-w-xl">
                  {home.transformation.body}
                </p>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-6">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#F8F6F1]/15">
                  <ResilientImage
                    src={home.transformation.imageUrl}
                    alt={home.transformation.imageAlt}
                    fallbackTitle="Personal Transformation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#F8F6F1]/15">
              {home.transformation.pillars.map((pillar, idx) => (
                <Reveal key={pillar.id} delay={idx * 0.05} className="space-y-2.5">
                  <h3 className="text-xl font-normal text-[#F8F6F1]">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-[#C9D1C4]">{pillar.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials */}
      {toggles.testimonials && activeTestimonials.length > 0 && (
        <section className="py-20 md:py-28 border-b border-[#E2DDD2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                  Client Reflections
                </p>
                <h2 className="text-3xl sm:text-4xl font-normal text-[#1E241E]">
                  Voices of stillness and steady change.
                </h2>
              </div>
              {activeTestimonials.some((t) => t.isPlaceholder) && (
                <p className="text-xs text-[#5A6358]">
                  Placeholder entries marked below — customize with verified client reviews in{' '}
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                    className="underline hover:text-[#1E241E]"
                  >
                    Admin
                  </a>
                  .
                </p>
              )}
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {activeTestimonials.map((item, idx) => (
                <Reveal
                  key={item.id}
                  delay={idx * 0.06}
                  className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-[#5E7059]" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#5E7059]" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-[#2C332B]">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFECE3] flex items-center gap-3">
                    {item.photoUrl && (
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E2DDD2]">
                        <ResilientImage
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E241E] truncate">{item.name}</p>
                      <p className="text-xs text-[#5A6358] truncate">{item.context}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Final CTA */}
      {toggles.finalCta && (
        <section className="py-20 md:py-28 bg-[#F0ECE3]/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Reveal className="space-y-4">
              <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                {home.finalCta.eyebrow}
              </p>
              <h2
                className="text-3xl sm:text-5xl font-normal leading-tight text-[#1E241E]"
                style={{ textWrap: 'balance' }}
              >
                {home.finalCta.headline}
              </h2>
              <p className="text-base sm:text-lg text-[#5A6358] max-w-2xl mx-auto leading-relaxed">
                {home.finalCta.body}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-7 py-3.5 rounded-lg text-sm font-medium text-[#F8F6F1] transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--brand-accent-deep)' }}
              >
                {home.finalCta.buttonLabel}
              </button>
              <a
                href={`tel:${settings.phone.replace(/\D/g, '')}`}
                className="px-6 py-3.5 rounded-lg text-sm font-medium border border-[#D4CEC0] bg-[#FFFFFF] text-[#1E241E] hover:bg-[#F8F6F1] transition-colors"
              >
                Call {formatPhoneDisplay(settings.phone)}
              </a>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}

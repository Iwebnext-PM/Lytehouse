import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { Reveal } from '../components/Reveal';
import { ServiceIcon } from '../components/ServiceIcon';
import { useSite } from '../context/SiteContext';
import type { ServiceItem } from '../types/cms';

export function ServicesPage() {
  const { siteData, openBookingModal } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);

  const activeServices = useMemo(
    () => siteData.services.filter((s) => s.active),
    [siteData.services]
  );

  const categories = useMemo(() => {
    const present = new Set(activeServices.map((s) => s.category));
    const ordered = siteData.serviceCategories.filter((c) => present.has(c));
    for (const cat of present) {
      if (!ordered.includes(cat)) ordered.push(cat);
    }
    return ['All', ...ordered];
  }, [activeServices, siteData.serviceCategories]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') return activeServices;
    return activeServices.filter((s) => s.category === selectedCategory);
  }, [activeServices, selectedCategory]);

  return (
    <div>
      {/* Header */}
      <section className="py-16 md:py-22 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Reveal className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
              Services &amp; Offerings
            </p>
            <h1
              className="text-4xl sm:text-5xl font-normal leading-[1.1] text-[#1E241E]"
              style={{ textWrap: 'balance' }}
            >
              Guided sessions for clarity, balance, and sustainable growth.
            </h1>
            <p className="text-base sm:text-lg text-[#5A6358] leading-relaxed">
              Explore individual mindfulness practices, holistic wellness consultations, personal
              development coaching, and small-group workshops.
            </p>
          </Reveal>

          {/* Interactive Category Filter Buttons */}
          <div
            role="tablist"
            aria-label="Filter services by category"
            className="pt-2 flex flex-wrap items-center gap-2"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#3F4F3B] text-[#F8F6F1]'
                      : 'bg-[#F0ECE3] text-[#4A5349] hover:bg-[#E6E0D3] hover:text-[#1E241E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="py-16 md:py-24 bg-[#F0ECE3]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl space-y-3">
              <p className="text-lg font-normal text-[#1E241E]">
                No offerings match this category yet.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-[#3F4F3B] text-[#F8F6F1] cursor-pointer"
              >
                Show All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredServices.map((srv, idx) => (
                <Reveal
                  key={srv.id}
                  delay={idx * 0.04}
                  className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-[#EFECE3]">
                      <ResilientImage
                        src={srv.imageUrl}
                        alt={srv.title}
                        fallbackTitle={srv.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                        <ServiceIcon name={srv.iconName} className="w-3.5 h-3.5 text-[#5E7059]" />
                        <span>{srv.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{srv.duration}</span>
                        <span aria-hidden="true">·</span>
                        <span>{srv.format}</span>
                      </div>

                      <h2 className="text-2xl font-normal text-[#1E241E] leading-snug">
                        {srv.title}
                      </h2>

                      <p className="text-sm leading-relaxed text-[#5A6358]">{srv.description}</p>

                      {srv.benefits.length > 0 && (
                        <ul className="space-y-2 pt-2 border-t border-[#EFECE3]">
                          {srv.benefits.map((benefit, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#394138]"
                            >
                              <Check
                                className="w-4 h-4 text-[#5E7059] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#F8F6F1]/70 border-t border-[#EFECE3] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setDetailService(srv)}
                      className="text-xs font-semibold text-[#4A5349] hover:text-[#1E241E] transition-colors cursor-pointer"
                    >
                      Learn More
                    </button>
                    <button
                      type="button"
                      onClick={() => openBookingModal(srv.id)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] whitespace-nowrap cursor-pointer"
                      style={{ backgroundColor: 'var(--brand-accent-deep)' }}
                    >
                      {srv.ctaLabel || 'Book a Session'}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Learn More Service Detail Modal */}
      {detailService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E241E]/45 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
        >
          <div className="w-full max-w-xl bg-[#F8F6F1] border border-[#E2DDD2] rounded-2xl overflow-hidden shadow-xl my-8">
            <div className="aspect-[16/9] relative bg-[#EFECE3]">
              <ResilientImage
                src={detailService.imageUrl}
                alt={detailService.title}
                fallbackTitle={detailService.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setDetailService(null)}
                aria-label="Close details"
                className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-[#F8F6F1]/90 text-[#1E241E] flex items-center justify-center hover:bg-[#FFFFFF] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                <span>{detailService.category}</span>
                <span aria-hidden="true">·</span>
                <span>{detailService.duration}</span>
                <span aria-hidden="true">·</span>
                <span>{detailService.format}</span>
                <span aria-hidden="true">·</span>
                <span>{detailService.priceLabel}</span>
              </div>
              <h2
                id="service-detail-title"
                className="text-3xl font-normal text-[#1E241E]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {detailService.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#4A5349]">
                {detailService.description}
              </p>
              {detailService.benefits.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-[#5A6358]">Key Benefits</p>
                  <ul className="space-y-2">
                    {detailService.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#2C332B]">
                        <Check className="w-4 h-4 text-[#5E7059] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E2DDD2]">
                <button
                  type="button"
                  onClick={() => setDetailService(null)}
                  className="px-4 py-2.5 text-sm text-[#5A6358] hover:text-[#1E241E] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = detailService.id;
                    setDetailService(null);
                    openBookingModal(id);
                  }}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
                  style={{ backgroundColor: 'var(--brand-accent-deep)' }}
                >
                  Book This Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

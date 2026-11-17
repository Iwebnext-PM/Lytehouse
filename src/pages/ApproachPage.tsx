import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { Reveal } from '../components/Reveal';
import { useSite } from '../context/SiteContext';

export function ApproachPage() {
  const { siteData, openBookingModal, navigate } = useSite();
  const { approach } = siteData;

  return (
    <div>
      {/* Hero Banner */}
      <section className="py-16 md:py-24 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Reveal className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
              {approach.eyebrow}
            </p>
            <h1
              className="text-4xl sm:text-5xl font-normal leading-[1.1] text-[#1E241E]"
              style={{ textWrap: 'balance' }}
            >
              {approach.headline}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#5A6358]">
              {approach.intro}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="aspect-[16/9] max-h-[520px] w-full rounded-2xl overflow-hidden border border-[#E2DDD2]">
              <ResilientImage
                src={approach.heroImageUrl}
                alt={approach.heroImageAlt}
                fallbackTitle="Our Holistic Approach"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Minimalist Mind-Body Continuum Diagram */}
      <section className="py-14 bg-[#F0ECE3]/55 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
                Integrated Rhythm
              </p>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1E241E]">
                Awareness, regulation, and steady action move together.
              </h2>
              <p className="text-sm leading-relaxed text-[#5A6358]">
                Every session honors how physical calm supports emotional insight—and how small,
                compassionate choices reinforce lasting purpose.
              </p>
            </div>
            <div className="lg:col-span-7 flex justify-center">
              <svg
                viewBox="0 0 560 180"
                className="w-full max-w-xl h-auto text-[#3F4F3B]"
                role="img"
                aria-label="Diagram showing connection between Mind-Body Awareness, Mindfulness, and Sustainable Balance"
              >
                <circle
                  cx="150"
                  cy="90"
                  r="64"
                  fill="none"
                  stroke="#5E7059"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                />
                <circle
                  cx="280"
                  cy="90"
                  r="64"
                  fill="none"
                  stroke="#5E7059"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                />
                <circle
                  cx="410"
                  cy="90"
                  r="64"
                  fill="none"
                  stroke="#3F4F3B"
                  strokeWidth="1.4"
                />
                <text
                  x="130"
                  y="86"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Body &amp;
                </text>
                <text
                  x="130"
                  y="102"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Nervous System
                </text>
                <text
                  x="280"
                  y="86"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Mindful
                </text>
                <text
                  x="280"
                  y="102"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Self-Awareness
                </text>
                <text
                  x="430"
                  y="86"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Sustainable
                </text>
                <text
                  x="430"
                  y="102"
                  textAnchor="middle"
                  className="fill-[#1E241E] text-[12px] font-medium"
                >
                  Daily Purpose
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars Alternating Editorial Sections */}
      <section className="py-16 md:py-24 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {approach.pillars.map((pillar, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <Reveal
                key={pillar.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
                <div className={`lg:col-span-6 space-y-4 ${reverse ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3 text-xs text-[#5E7059]">
                    <span className="font-tabular font-semibold">{pillar.number}.</span>
                    <span aria-hidden="true">·</span>
                    <span>{pillar.subtitle}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-normal text-[#1E241E]">
                    {pillar.title}
                  </h2>
                  <p className="text-base leading-relaxed text-[#4A5349]">{pillar.description}</p>
                  <div className="pt-3 border-t border-[#E2DDD2]">
                    <p className="text-xs font-semibold text-[#5A6358]">In Practice</p>
                    <p className="text-sm text-[#394138] mt-1">{pillar.practiceNote}</p>
                  </div>
                </div>

                <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2DDD2]">
                    <ResilientImage
                      src={pillar.imageUrl}
                      alt={pillar.title}
                      fallbackTitle={pillar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Closing Reflection & Action */}
      <section className="py-20 bg-[#F0ECE3]/65">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Reveal className="space-y-4">
            <blockquote
              className="text-2xl sm:text-4xl font-normal italic text-[#1E241E] leading-snug"
              style={{ fontFamily: 'var(--font-serif)', textWrap: 'balance' }}
            >
              “{approach.closingQuote}”
            </blockquote>
            <p className="text-xs font-medium tracking-wider text-[#5A6358]">
              {approach.closingAttribution}
            </p>
          </Reveal>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="px-6 py-3 rounded-lg text-sm font-medium border border-[#D4CEC0] bg-[#FFFFFF] text-[#1E241E] hover:bg-[#F8F6F1] transition-colors cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

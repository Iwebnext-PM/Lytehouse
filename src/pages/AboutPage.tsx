import { ArrowRight } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { Reveal } from '../components/Reveal';
import { useSite } from '../context/SiteContext';

export function AboutPage() {
  const { siteData, openBookingModal, navigate } = useSite();
  const { about } = siteData;

  return (
    <div>
      {/* Editorial Intro */}
      <section className="py-16 md:py-24 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <Reveal className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-xs font-semibold tracking-wider text-[#5E7059]">{about.eyebrow}</p>
              <h1
                className="text-4xl sm:text-5xl font-normal leading-[1.1] text-[#1E241E]"
                style={{ textWrap: 'balance' }}
              >
                {about.headline}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#4A5349]">{about.intro}</p>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="aspect-[4/3] lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-[#E2DDD2]">
                <ResilientImage
                  src={about.imageUrl}
                  alt={about.imageAlt}
                  fallbackTitle="Lyte House Collective Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Commitment */}
      <section className="py-16 md:py-24 bg-[#F0ECE3]/55 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-7 space-y-3">
            <h2 className="text-2xl font-normal text-[#1E241E]">{about.missionTitle}</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#5A6358]">
              {about.missionBody}
            </p>
          </Reveal>

          <Reveal delay={0.05} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-7 space-y-3">
            <h2 className="text-2xl font-normal text-[#1E241E]">{about.visionTitle}</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#5A6358]">
              {about.visionBody}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-7 space-y-3">
            <h2 className="text-2xl font-normal text-[#1E241E]">{about.commitmentTitle}</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#5A6358]">
              {about.commitmentBody}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Reveal className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#5E7059]">Core Values</p>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#1E241E]">
              Guiding principles behind every conversation.
            </h2>
          </Reveal>

          <div className="divide-y divide-[#E2DDD2] border-t border-b border-[#E2DDD2]">
            {about.values.map((val, idx) => (
              <Reveal
                key={val.id}
                delay={idx * 0.05}
                className="py-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline"
              >
                <span className="md:col-span-2 text-sm font-tabular text-[#5E7059]">
                  0{idx + 1}.
                </span>
                <h3 className="md:col-span-4 text-xl sm:text-2xl font-normal text-[#1E241E]">
                  {val.title}
                </h3>
                <p className="md:col-span-6 text-sm sm:text-base leading-relaxed text-[#5A6358]">
                  {val.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* People Behind the Brand (Editable in Admin, zero invented credentials) */}
      <section className="py-16 md:py-24 bg-[#F0ECE3]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-wider text-[#5E7059]">Leadership &amp; Care</p>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#1E241E]">
                {about.teamSectionTitle}
              </h2>
              <p className="text-sm text-[#5A6358]">{about.teamSectionNote}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-xs font-semibold text-[#3F4F3B] underline underline-offset-4 hover:text-[#1E241E] self-start md:self-auto cursor-pointer"
            >
              Edit Team Profiles in Admin
            </button>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.team.map((member, idx) => (
              <Reveal
                key={member.id}
                delay={idx * 0.06}
                className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch"
              >
                <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto min-h-[220px]">
                  <ResilientImage
                    src={member.imageUrl}
                    alt={member.name}
                    fallbackTitle={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-[#5E7059] font-medium">{member.role}</p>
                    <h3 className="text-2xl font-normal text-[#1E241E]">{member.name}</h3>
                    <p className="text-sm leading-relaxed text-[#5A6358]">{member.bio}</p>
                  </div>
                  {member.isPlaceholder && (
                    <p className="text-xs text-[#737B70]">
                      Template profile — personalize in Admin Dashboard.
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="pt-6 flex flex-wrap items-center gap-4">
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
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-lg text-sm font-medium border border-[#D4CEC0] bg-[#FFFFFF] text-[#1E241E] hover:bg-[#F8F6F1] transition-colors cursor-pointer"
            >
              Reach Out Directly
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

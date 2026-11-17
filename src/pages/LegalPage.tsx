import { useSite } from '../context/SiteContext';

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { siteData, navigate } = useSite();
  const doc =
    type === 'privacy' ? siteData.legal.privacyPolicy : siteData.legal.termsAndConditions;

  const blocks = doc.content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <header className="space-y-3 pb-6 border-b border-[#E2DDD2]">
          <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
            {siteData.settings.businessName}
          </p>
          <h1 className="text-4xl sm:text-5xl font-normal text-[#1E241E]">{doc.title}</h1>
          <p className="text-xs text-[#5A6358]">Last updated: {doc.lastUpdated}</p>
        </header>

        <div className="space-y-5 text-base leading-relaxed text-[#2C332B]">
          {blocks.map((block, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {block}
            </p>
          ))}
        </div>

        <div className="pt-6 border-t border-[#E2DDD2]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-[#3F4F3B] underline underline-offset-4 hover:text-[#1E241E] cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    </section>
  );
}

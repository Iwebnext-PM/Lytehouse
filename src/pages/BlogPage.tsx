import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { Reveal } from '../components/Reveal';
import { useSite } from '../context/SiteContext';

export function BlogPage() {
  const { siteData, currentPath, navigate, openBookingModal } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const publishedPosts = useMemo(
    () => siteData.blogPosts.filter((p) => p.published),
    [siteData.blogPosts]
  );

  // Check if viewing single article `/blog/:slug`
  const articleSlug = currentPath.startsWith('/blog/')
    ? currentPath.slice('/blog/'.length).replace(/\/+$/, '')
    : null;

  const activeArticle = articleSlug
    ? publishedPosts.find((p) => p.slug === articleSlug)
    : null;

  const categories = useMemo(() => {
    const set = new Set(siteData.blogCategories);
    for (const p of publishedPosts) {
      if (p.category) set.add(p.category);
    }
    return ['All', ...Array.from(set)];
  }, [siteData.blogCategories, publishedPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedPosts.filter((post) => {
      const catMatch = selectedCategory === 'All' || post.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  if (articleSlug && activeArticle) {
    const paragraphs = activeArticle.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    return (
      <article className="py-14 md:py-22">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5E7059] hover:text-[#1E241E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to All Resources
          </button>

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
              <span>{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={activeArticle.publishedAt}>{activeArticle.publishedAt}</time>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.readTime}</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-normal leading-[1.12] text-[#1E241E]"
              style={{ textWrap: 'balance' }}
            >
              {activeArticle.title}
            </h1>
            <p className="text-sm text-[#5A6358]">By {activeArticle.author}</p>
          </header>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#E2DDD2]">
            <ResilientImage
              src={activeArticle.featuredImageUrl}
              alt={activeArticle.title}
              fallbackTitle={activeArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-base sm:text-lg leading-[1.75] text-[#2C332B]">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-8 mt-8 border-t border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F0ECE3]/70 p-6 rounded-2xl">
            <div className="space-y-1">
              <p className="text-base font-medium text-[#1E241E]">
                Interested in exploring this practice 1:1?
              </p>
              <p className="text-sm text-[#5A6358]">
                Schedule a mindfulness or personal development session at your pace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] whitespace-nowrap shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Book a Session
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div>
      {/* Header & Search/Category Controls */}
      <section className="py-16 md:py-22 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
              Journal &amp; Resources
            </p>
            <h1
              className="text-4xl sm:text-5xl font-normal leading-[1.1] text-[#1E241E]"
              style={{ textWrap: 'balance' }}
            >
              Reflections on mindfulness, clarity, and intentional living.
            </h1>
            <p className="text-base sm:text-lg text-[#5A6358] leading-relaxed">
              Practical essays and grounded tools across mental wellness, personal growth, and
              healthy daily rhythms.
            </p>
          </Reveal>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter articles by category"
              className="flex flex-wrap items-center gap-2"
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

            {/* Live Search */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search
                className="w-4 h-4 text-[#5A6358] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search blog articles"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 bg-[#F0ECE3]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl space-y-3">
              <p className="text-lg text-[#1E241E]">No articles match your current filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[#3F4F3B] text-[#F8F6F1] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredPosts.map((post, idx) => (
                <Reveal
                  key={post.id}
                  delay={idx * 0.04}
                  className="group bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <a
                      href={`/blog/${post.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/blog/${post.slug}`);
                      }}
                      className="block aspect-[4/3] overflow-hidden bg-[#EFECE3]"
                    >
                      <ResilientImage
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fallbackTitle={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </a>
                    <div className="p-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                        <span>{post.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.publishedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-normal text-[#1E241E] leading-snug">
                        <a
                          href={`/blog/${post.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/blog/${post.slug}`);
                          }}
                          className="hover:text-[#3F4F3B] transition-colors"
                        >
                          {post.title}
                        </a>
                      </h2>
                      <p className="text-sm leading-relaxed text-[#5A6358]">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-[#EFECE3] flex items-center justify-between text-xs">
                    <span className="text-[#5A6358]">{post.author}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="font-semibold text-[#3F4F3B] hover:text-[#1E241E] cursor-pointer"
                    >
                      Read Article
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

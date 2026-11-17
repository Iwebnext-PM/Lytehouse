import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type {
  AboutContent,
  ApproachContent,
  BlogPost,
  HomeContent,
  MediaItem,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../../types/cms';
import { adminFetch } from './adminApi';

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  media: MediaItem[];
}

function ImageSelector({ label, value, onChange, media }: ImageSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#4A5349]">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select
          value={media.some((m) => m.url === value) ? value : '__custom__'}
          onChange={(e) => {
            if (e.target.value !== '__custom__') onChange(e.target.value);
          }}
          className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs text-[#1E241E]"
        >
          <option value="__custom__">Custom URL / Path</option>
          {media.map((m) => (
            <option key={m.id} value={m.url}>
              {m.title} ({m.category})
            </option>
          ))}
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... or https://..."
          className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs text-[#1E241E]"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Content Editor Panel (Home, About, Approach, Nav & Footer)              */
/* -------------------------------------------------------------------------- */
export function ContentEditorPanel({
  home,
  about,
  approach,
  settings,
  media,
  onSaved,
  notify,
}: {
  home: HomeContent;
  about: AboutContent;
  approach: ApproachContent;
  settings: SiteSettings;
  media: MediaItem[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [subTab, setSubTab] = useState<'home' | 'about' | 'approach' | 'nav'>('home');
  const [homeDraft, setHomeDraft] = useState<HomeContent>(home);
  const [aboutDraft, setAboutDraft] = useState<AboutContent>(about);
  const [approachDraft, setApproachDraft] = useState<ApproachContent>(approach);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  const saveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch('/api/admin/home', {
        method: 'PUT',
        body: JSON.stringify(homeDraft),
      });
      await onSaved();
      notify('Home page content saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save Home content', true);
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch('/api/admin/about', {
        method: 'PUT',
        body: JSON.stringify(aboutDraft),
      });
      await onSaved();
      notify('About Us content saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save About content', true);
    } finally {
      setSaving(false);
    }
  };

  const saveApproach = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch('/api/admin/approach', {
        method: 'PUT',
        body: JSON.stringify(approachDraft),
      });
      await onSaved();
      notify('Our Approach content saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save Approach content', true);
    } finally {
      setSaving(false);
    }
  };

  const saveNavFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsDraft),
      });
      await onSaved();
      notify('Navigation and footer settings saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save navigation', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1 bg-[#F0ECE3] rounded-xl border border-[#E2DDD2] w-fit">
        {(
          [
            ['home', 'Home Page'],
            ['about', 'About Us'],
            ['approach', 'Our Approach'],
            ['nav', 'Navigation & Footer'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSubTab(key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              subTab === key
                ? 'bg-[#FFFFFF] text-[#1E241E] shadow-xs'
                : 'text-[#5A6358] hover:text-[#1E241E]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'home' && (
        <form onSubmit={saveHome} className="space-y-6 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6">
          <h3 className="text-xl font-normal text-[#1E241E]">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Eyebrow</label>
              <input
                type="text"
                value={homeDraft.hero.eyebrow}
                onChange={(e) =>
                  setHomeDraft({ ...homeDraft, hero: { ...homeDraft.hero, eyebrow: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Hero Headline</label>
              <input
                type="text"
                value={homeDraft.hero.headline}
                onChange={(e) =>
                  setHomeDraft({ ...homeDraft, hero: { ...homeDraft.hero, headline: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A5349]">Hero Subheadline</label>
            <textarea
              rows={2}
              value={homeDraft.hero.subheadline}
              onChange={(e) =>
                setHomeDraft({ ...homeDraft, hero: { ...homeDraft.hero, subheadline: e.target.value } })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Primary CTA Label</label>
              <input
                type="text"
                value={homeDraft.hero.primaryCtaLabel}
                onChange={(e) =>
                  setHomeDraft({
                    ...homeDraft,
                    hero: { ...homeDraft.hero, primaryCtaLabel: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Secondary CTA Label</label>
              <input
                type="text"
                value={homeDraft.hero.secondaryCtaLabel}
                onChange={(e) =>
                  setHomeDraft({
                    ...homeDraft,
                    hero: { ...homeDraft.hero, secondaryCtaLabel: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
          </div>
          <ImageSelector
            label="Hero Background Image"
            value={homeDraft.hero.imageUrl}
            onChange={(url) =>
              setHomeDraft({ ...homeDraft, hero: { ...homeDraft.hero, imageUrl: url } })
            }
            media={media}
          />

          <hr className="border-[#E2DDD2]" />
          <h3 className="text-xl font-normal text-[#1E241E]">Philosophy Section</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={homeDraft.philosophy.headline}
              onChange={(e) =>
                setHomeDraft({
                  ...homeDraft,
                  philosophy: { ...homeDraft.philosophy, headline: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <textarea
              rows={2}
              value={homeDraft.philosophy.body}
              onChange={(e) =>
                setHomeDraft({
                  ...homeDraft,
                  philosophy: { ...homeDraft.philosophy, body: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <ImageSelector
              label="Philosophy Image"
              value={homeDraft.philosophy.imageUrl}
              onChange={(url) =>
                setHomeDraft({
                  ...homeDraft,
                  philosophy: { ...homeDraft.philosophy, imageUrl: url },
                })
              }
              media={media}
            />
          </div>

          <hr className="border-[#E2DDD2]" />
          <h3 className="text-xl font-normal text-[#1E241E]">Final Call to Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={homeDraft.finalCta.headline}
              onChange={(e) =>
                setHomeDraft({
                  ...homeDraft,
                  finalCta: { ...homeDraft.finalCta, headline: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={homeDraft.finalCta.buttonLabel}
              onChange={(e) =>
                setHomeDraft({
                  ...homeDraft,
                  finalCta: { ...homeDraft.finalCta, buttonLabel: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>
          <textarea
            rows={2}
            value={homeDraft.finalCta.body}
            onChange={(e) =>
              setHomeDraft({
                ...homeDraft,
                finalCta: { ...homeDraft.finalCta, body: e.target.value },
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            {saving ? 'Saving...' : 'Save Home Content'}
          </button>
        </form>
      )}

      {subTab === 'about' && (
        <form onSubmit={saveAbout} className="space-y-6 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Headline</label>
              <input
                type="text"
                value={aboutDraft.headline}
                onChange={(e) => setAboutDraft({ ...aboutDraft, headline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <ImageSelector
              label="Studio Image"
              value={aboutDraft.imageUrl}
              onChange={(url) => setAboutDraft({ ...aboutDraft, imageUrl: url })}
              media={media}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A5349]">Introduction</label>
            <textarea
              rows={3}
              value={aboutDraft.intro}
              onChange={(e) => setAboutDraft({ ...aboutDraft, intro: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Mission</label>
              <textarea
                rows={4}
                value={aboutDraft.missionBody}
                onChange={(e) => setAboutDraft({ ...aboutDraft, missionBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Vision</label>
              <textarea
                rows={4}
                value={aboutDraft.visionBody}
                onChange={(e) => setAboutDraft({ ...aboutDraft, visionBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Commitment</label>
              <textarea
                rows={4}
                value={aboutDraft.commitmentBody}
                onChange={(e) => setAboutDraft({ ...aboutDraft, commitmentBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
          </div>

          <hr className="border-[#E2DDD2]" />
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-normal text-[#1E241E]">Team Profiles</h3>
            <button
              type="button"
              onClick={() =>
                setAboutDraft({
                  ...aboutDraft,
                  team: [
                    ...aboutDraft.team,
                    {
                      id: `team-${Date.now()}`,
                      name: 'New Practitioner',
                      role: 'Role / Specialty',
                      bio: '',
                      imageUrl: media[0]?.url || '',
                      isPlaceholder: false,
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Member
            </button>
          </div>
          <div className="space-y-4">
            {aboutDraft.team.map((member, idx) => (
              <div key={member.id} className="p-4 rounded-xl border border-[#E2DDD2] bg-[#F8F6F1]/60 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const next = [...aboutDraft.team];
                        next[idx] = { ...member, name: e.target.value };
                        setAboutDraft({ ...aboutDraft, team: next });
                      }}
                      placeholder="Name"
                      className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const next = [...aboutDraft.team];
                        next[idx] = { ...member, role: e.target.value };
                        setAboutDraft({ ...aboutDraft, team: next });
                      }}
                      placeholder="Role"
                      className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAboutDraft({
                        ...aboutDraft,
                        team: aboutDraft.team.filter((m) => m.id !== member.id),
                      })
                    }
                    className="p-2 text-[#7A2727] hover:bg-[#FDF2F2] rounded-lg cursor-pointer"
                    aria-label="Remove team member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={member.bio}
                  onChange={(e) => {
                    const next = [...aboutDraft.team];
                    next[idx] = { ...member, bio: e.target.value };
                    setAboutDraft({ ...aboutDraft, team: next });
                  }}
                  placeholder="Bio"
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-xs text-[#4A5349]">
                    <input
                      type="checkbox"
                      checked={member.isPlaceholder}
                      onChange={(e) => {
                        const next = [...aboutDraft.team];
                        next[idx] = { ...member, isPlaceholder: e.target.checked };
                        setAboutDraft({ ...aboutDraft, team: next });
                      }}
                    />
                    Mark as editable template placeholder
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </form>
      )}

      {subTab === 'approach' && (
        <form onSubmit={saveApproach} className="space-y-6 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Headline</label>
              <input
                type="text"
                value={approachDraft.headline}
                onChange={(e) => setApproachDraft({ ...approachDraft, headline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <ImageSelector
              label="Banner Image"
              value={approachDraft.heroImageUrl}
              onChange={(url) => setApproachDraft({ ...approachDraft, heroImageUrl: url })}
              media={media}
            />
          </div>
          <textarea
            rows={2}
            value={approachDraft.intro}
            onChange={(e) => setApproachDraft({ ...approachDraft, intro: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#1E241E]">Approach Pillars</h3>
            {approachDraft.pillars.map((pillar, idx) => (
              <div key={pillar.id} className="p-4 rounded-xl border border-[#E2DDD2] bg-[#F8F6F1]/60 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const next = [...approachDraft.pillars];
                      next[idx] = { ...pillar, title: e.target.value };
                      setApproachDraft({ ...approachDraft, pillars: next });
                    }}
                    className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm font-medium"
                  />
                  <input
                    type="text"
                    value={pillar.subtitle}
                    onChange={(e) => {
                      const next = [...approachDraft.pillars];
                      next[idx] = { ...pillar, subtitle: e.target.value };
                      setApproachDraft({ ...approachDraft, pillars: next });
                    }}
                    className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={pillar.description}
                  onChange={(e) => {
                    const next = [...approachDraft.pillars];
                    next[idx] = { ...pillar, description: e.target.value };
                    setApproachDraft({ ...approachDraft, pillars: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm"
                />
                <input
                  type="text"
                  value={pillar.practiceNote}
                  onChange={(e) => {
                    const next = [...approachDraft.pillars];
                    next[idx] = { ...pillar, practiceNote: e.target.value };
                    setApproachDraft({ ...approachDraft, pillars: next });
                  }}
                  placeholder="In Practice note"
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            {saving ? 'Saving...' : 'Save Approach Content'}
          </button>
        </form>
      )}

      {subTab === 'nav' && (
        <form onSubmit={saveNavFooter} className="space-y-6 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6">
          <h3 className="text-xl font-normal text-[#1E241E]">Navigation Menu Items</h3>
          <div className="space-y-2.5">
            {settingsDraft.navigation.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const next = [...settingsDraft.navigation];
                    next[idx] = { ...item, label: e.target.value };
                    setSettingsDraft({ ...settingsDraft, navigation: next });
                  }}
                  className="col-span-5 px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
                />
                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => {
                    const next = [...settingsDraft.navigation];
                    next[idx] = { ...item, path: e.target.value };
                    setSettingsDraft({ ...settingsDraft, navigation: next });
                  }}
                  className="col-span-5 px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs font-tabular"
                />
                <label className="col-span-2 inline-flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => {
                      const next = [...settingsDraft.navigation];
                      next[idx] = { ...item, enabled: e.target.checked };
                      setSettingsDraft({ ...settingsDraft, navigation: next });
                    }}
                  />
                  Show
                </label>
              </div>
            ))}
          </div>

          <hr className="border-[#E2DDD2]" />
          <h3 className="text-xl font-normal text-[#1E241E]">Footer Copy</h3>
          <div className="space-y-3">
            <textarea
              rows={2}
              value={settingsDraft.footer.description}
              onChange={(e) =>
                setSettingsDraft({
                  ...settingsDraft,
                  footer: { ...settingsDraft.footer, description: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={settingsDraft.footer.copyright}
              onChange={(e) =>
                setSettingsDraft({
                  ...settingsDraft,
                  footer: { ...settingsDraft.footer, copyright: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            {saving ? 'Saving...' : 'Save Navigation & Footer'}
          </button>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Services CRUD Panel                                                     */
/* -------------------------------------------------------------------------- */
export function ServicesCrudPanel({
  services,
  categories,
  media,
  onSaved,
  notify,
}: {
  services: ServiceItem[];
  categories: string[];
  media: MediaItem[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  const startCreate = () => {
    setIsNew(true);
    setBenefitsText('Personalized session pacing\nPractical daily grounding tools');
    setEditing({
      id: '',
      title: '',
      slug: '',
      category: categories[0] || 'Holistic Wellness',
      summary: '',
      description: '',
      imageUrl: media[0]?.url || '',
      iconName: 'Wind',
      benefits: [],
      duration: '60 min',
      format: 'In-Person or Virtual',
      priceLabel: 'Individual Session',
      ctaLabel: 'Book a Session',
      featured: false,
      active: true,
    });
  };

  const startEdit = (srv: ServiceItem) => {
    setIsNew(false);
    setEditing(srv);
    setBenefitsText(srv.benefits.join('\n'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      benefits: benefitsText
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean),
    };
    try {
      if (isNew) {
        await adminFetch('/api/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/api/admin/services/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      await onSaved();
      notify(isNew ? 'Service created.' : 'Service updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save service', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Service deleted.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete service', true);
    }
  };

  const addCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    try {
      await adminFetch('/api/admin/service-categories', {
        method: 'PUT',
        body: JSON.stringify({ categories: [...categories, trimmed] }),
      });
      setNewCategory('');
      await onSaved();
      notify('Category added.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update categories', true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New service category..."
            className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
          >
            Add Category
          </button>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
          style={{ backgroundColor: 'var(--brand-accent-deep)' }}
        >
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-normal text-[#1E241E]">
            {isNew ? 'Create Service' : `Edit: ${editing.title}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="Service Title *"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={editing.duration}
              onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
              placeholder="Duration (e.g. 60 min)"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={editing.format}
              onChange={(e) => setEditing({ ...editing, format: e.target.value })}
              placeholder="Format (e.g. In-Person or Virtual)"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>
          <input
            type="text"
            value={editing.summary}
            onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
            placeholder="Short Card Summary"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <textarea
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            placeholder="Full Service Description"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <textarea
            rows={3}
            value={benefitsText}
            onChange={(e) => setBenefitsText(e.target.value)}
            placeholder="Benefits (one per line)"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
          />
          <ImageSelector
            label="Service Image"
            value={editing.imageUrl}
            onChange={(url) => setEditing({ ...editing, imageUrl: url })}
            media={media}
          />
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              />
              Featured on Home Page
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
              Active / Visible
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 text-xs text-[#5A6358] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-[#F0ECE3]/60 border-b border-[#E2DDD2] text-xs text-[#5A6358]">
            <tr>
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Duration</th>
              <th className="py-3 px-4 font-semibold">State</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE3]">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-[#F8F6F1]/70">
                <td className="py-3 px-4 font-medium text-[#1E241E]">{srv.title}</td>
                <td className="py-3 px-4 text-xs text-[#5A6358]">{srv.category}</td>
                <td className="py-3 px-4 text-xs font-tabular text-[#5A6358]">{srv.duration}</td>
                <td className="py-3 px-4 text-xs text-[#5A6358]">
                  {srv.active ? 'Active' : 'Hidden'} {srv.featured ? '· Featured' : ''}
                </td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button
                    type="button"
                    onClick={() => startEdit(srv)}
                    className="text-xs font-semibold text-[#3F4F3B] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id)}
                    className="text-xs font-semibold text-[#7A2727] hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Testimonials CRUD Panel                                                 */
/* -------------------------------------------------------------------------- */
export function TestimonialsCrudPanel({
  testimonials,
  media,
  onSaved,
  notify,
}: {
  testimonials: TestimonialItem[];
  media: MediaItem[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      if (isNew) {
        await adminFetch('/api/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      } else {
        await adminFetch(`/api/admin/testimonials/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      await onSaved();
      notify(isNew ? 'Testimonial added.' : 'Testimonial updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save testimonial', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Testimonial removed.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete testimonial', true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsNew(true);
            setEditing({
              id: '',
              name: '',
              context: 'Individual Coaching Client',
              photoUrl: '',
              content: '',
              rating: 5,
              active: true,
              isPlaceholder: false,
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
          style={{ backgroundColor: 'var(--brand-accent-deep)' }}
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              required
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="Client Name *"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={editing.context}
              onChange={(e) => setEditing({ ...editing, context: e.target.value })}
              placeholder="Program / Context"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <select
              value={editing.rating}
              onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            required
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            placeholder="Client reflection quote..."
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <ImageSelector
            label="Optional Client Photo"
            value={editing.photoUrl}
            onChange={(url) => setEditing({ ...editing, photoUrl: url })}
            media={media}
          />
          <div className="flex flex-wrap gap-5 text-xs">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
              Display on Live Site
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.isPlaceholder}
                onChange={(e) => setEditing({ ...editing, isPlaceholder: e.target.checked })}
              />
              Mark as Placeholder
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(null)} className="text-xs text-[#5A6358] cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
              style={{ backgroundColor: 'var(--brand-accent-deep)' }}
            >
              Save Testimonial
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                <span className="font-semibold text-[#1E241E]">{t.name}</span>
                <span>·</span>
                <span>{t.rating}/5</span>
                <span>·</span>
                <span>{t.active ? 'Visible' : 'Hidden'}</span>
                {t.isPlaceholder && <span>· Placeholder</span>}
              </div>
              <p className="text-sm text-[#4A5349]">{t.content}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsNew(false);
                  setEditing(t);
                }}
                className="text-xs font-semibold text-[#3F4F3B] hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-xs font-semibold text-[#7A2727] hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Blog & Categories CRUD Panel                                            */
/* -------------------------------------------------------------------------- */
export function BlogCrudPanel({
  posts,
  categories,
  media,
  onSaved,
  notify,
}: {
  posts: BlogPost[];
  categories: string[];
  media: MediaItem[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      if (isNew) {
        await adminFetch('/api/admin/blog', {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      } else {
        await adminFetch(`/api/admin/blog/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      }
      setEditing(null);
      await onSaved();
      notify(isNew ? 'Article published.' : 'Article updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save article', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Article deleted.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete article', true);
    }
  };

  const addCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    try {
      await adminFetch('/api/admin/blog-categories', {
        method: 'PUT',
        body: JSON.stringify({ categories: [...categories, trimmed] }),
      });
      setNewCategory('');
      await onSaved();
      notify('Blog category added.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to add category', true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New blog category..."
            className="px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] cursor-pointer"
          >
            Add Category
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsNew(true);
            setEditing({
              id: '',
              slug: '',
              title: '',
              excerpt: '',
              content: '',
              featuredImageUrl: media[0]?.url || '',
              author: 'Lyte House Editorial',
              publishedAt: new Date().toISOString().slice(0, 10),
              category: categories[0] || 'Mindfulness',
              readTime: '4 min read',
              seoTitle: '',
              seoDescription: '',
              seoKeywords: '',
              published: true,
            });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
          style={{ backgroundColor: 'var(--brand-accent-deep)' }}
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="Article Title *"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              placeholder="URL Slug (auto-generated if blank)"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs font-tabular"
            />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                placeholder="Author"
                className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
              <input
                type="date"
                value={editing.publishedAt}
                onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })}
                className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
          </div>
          <input
            type="text"
            value={editing.excerpt}
            onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
            placeholder="Short Excerpt"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <textarea
            rows={6}
            required
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            placeholder="Article Content (separate paragraphs with blank lines)"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <ImageSelector
            label="Featured Image"
            value={editing.featuredImageUrl}
            onChange={(url) => setEditing({ ...editing, featuredImageUrl: url })}
            media={media}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#EFECE3]">
            <input
              type="text"
              value={editing.seoTitle}
              onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
              placeholder="SEO Meta Title"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
            />
            <input
              type="text"
              value={editing.seoKeywords}
              onChange={(e) => setEditing({ ...editing, seoKeywords: e.target.value })}
              placeholder="SEO Keywords"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
            />
          </div>
          <input
            type="text"
            value={editing.seoDescription}
            onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
            placeholder="SEO Meta Description"
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
          />
          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Published
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(null)} className="text-xs text-[#5A6358] cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
                style={{ backgroundColor: 'var(--brand-accent-deep)' }}
              >
                Save Article
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-[#F0ECE3]/60 border-b border-[#E2DDD2] text-xs text-[#5A6358]">
            <tr>
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Published</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE3]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[#F8F6F1]/70">
                <td className="py-3 px-4 font-medium text-[#1E241E]">{post.title}</td>
                <td className="py-3 px-4 text-xs text-[#5A6358]">{post.category}</td>
                <td className="py-3 px-4 text-xs font-tabular text-[#5A6358]">
                  {post.publishedAt} · {post.published ? 'Live' : 'Draft'}
                </td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNew(false);
                      setEditing(post);
                    }}
                    className="text-xs font-semibold text-[#3F4F3B] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="text-xs font-semibold text-[#7A2727] hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

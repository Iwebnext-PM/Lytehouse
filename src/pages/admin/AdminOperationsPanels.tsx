import React, { useState } from 'react';
import { Copy, RefreshCw, Trash2, Upload } from 'lucide-react';
import { ResilientImage } from '../../components/ResilientImage';
import type {
  AppointmentBooking,
  BookingStatus,
  CommunicationLog,
  ContactInquiry,
  LegalPages,
  MediaItem,
  PageSeo,
  SiteSettings,
} from '../../types/cms';
import { adminFetch, readFileAsDataUrl } from './adminApi';

/* -------------------------------------------------------------------------- */
/* 1. Media Library Panel                                                     */
/* -------------------------------------------------------------------------- */
export function MediaLibraryPanel({
  media,
  onSaved,
  notify,
}: {
  media: MediaItem[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('Uploads');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await adminFetch('/api/admin/media/upload', {
        method: 'POST',
        body: JSON.stringify({
          dataUrl,
          filename: file.name,
          title: title.trim() || file.name,
          altText: altText.trim() || file.name,
          category: category.trim() || 'Uploads',
        }),
      });
      setTitle('');
      setAltText('');
      await onSaved();
      notify('Image uploaded to media library.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed', true);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleReplace = async (id: string, file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await adminFetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ dataUrl }),
      });
      await onSaved();
      notify('Image file replaced.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Replace failed', true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Media item deleted.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-[#1E241E]">Upload New Image</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Image Title (optional)"
            className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descriptive Alt Text"
            className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (Banners, Services...)"
            className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer" style={{ backgroundColor: 'var(--brand-accent-deep)' }}>
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Choose Image File to Upload'}</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-[#EFECE3]">
              <ResilientImage src={item.url} alt={item.altText} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-[#5A6358]">
                  {item.category} · {item.source}
                </p>
                <p className="text-sm font-semibold text-[#1E241E] truncate">{item.title}</p>
                <p className="text-xs text-[#5A6358] truncate">{item.altText}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EFECE3]">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(item.url);
                    notify('Image URL copied to clipboard.');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#3F4F3B] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy URL
                </button>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1 text-xs font-medium text-[#4A5349] hover:text-[#1E241E] cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleReplace(item.id, f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-[#7A2727] hover:underline cursor-pointer"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Bookings & Automated Communications Panel                               */
/* -------------------------------------------------------------------------- */
export function BookingsAndCommsPanel({
  bookings,
  communications,
  settings,
  onSaved,
  notify,
}: {
  bookings: AppointmentBooking[];
  communications: CommunicationLog[];
  settings: SiteSettings;
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [autoDraft, setAutoDraft] = useState(settings.automationSettings);
  const [savingAuto, setSavingAuto] = useState(false);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await adminFetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await onSaved();
      notify(`Booking marked ${status} & client update logged.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update booking', true);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await adminFetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Booking removed.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to remove booking', true);
    }
  };

  const saveAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAuto(true);
    try {
      await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ ...settings, automationSettings: autoDraft }),
      });
      await onSaved();
      notify('Automated communication templates saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save templates', true);
    } finally {
      setSavingAuto(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Bookings Table */}
      <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2DDD2] flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#1E241E]">Scheduled Sessions</h3>
          <span className="text-xs font-tabular text-[#5A6358]">{bookings.length} total</span>
        </div>

        {bookings.length === 0 ? (
          <p className="p-8 text-sm text-[#5A6358] text-center">
            No sessions scheduled yet. New bookings from visitors will appear here automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#F0ECE3]/60 border-b border-[#E2DDD2] text-xs text-[#5A6358]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Client</th>
                  <th className="py-3 px-4 font-semibold">Offering</th>
                  <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE3]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8F6F1]/70">
                    <td className="py-3 px-4 font-tabular text-xs font-semibold">{b.confirmationCode}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1E241E]">{b.clientName}</p>
                      <p className="text-xs text-[#5A6358]">{b.clientEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#4A5349]">
                      <p className="font-medium text-[#1E241E]">{b.serviceTitle}</p>
                      <p>{b.format}</p>
                    </td>
                    <td className="py-3 px-4 font-tabular text-xs text-[#1E241E]">
                      {b.date} · {b.timeSlot}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D8D2C5] text-xs bg-[#FFFFFF]"
                      >
                        {(['Confirmed', 'Pending', 'Rescheduled', 'Completed', 'Cancelled'] as const).map(
                          (st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteBooking(b.id)}
                        className="text-xs text-[#7A2727] hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Automated Communication Templates */}
      <form onSubmit={saveAutomation} className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-[#1E241E]">Automated Client Communication Templates</h3>
        <label className="inline-flex items-center gap-2 text-xs text-[#4A5349]">
          <input
            type="checkbox"
            checked={autoDraft.autoConfirmBookings}
            onChange={(e) =>
              setAutoDraft({ ...autoDraft, autoConfirmBookings: e.target.checked })
            }
          />
          Automatically mark new online bookings as Confirmed &amp; dispatch confirmation
        </label>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#4A5349]">
            Booking Confirmation Template (supports {'{{name}}, {{service}}, {{format}}, {{date}}, {{time}}, {{code}}'})
          </label>
          <textarea
            rows={3}
            value={autoDraft.bookingConfirmationTemplate}
            onChange={(e) =>
              setAutoDraft({ ...autoDraft, bookingConfirmationTemplate: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#4A5349]">
            Contact Auto-Acknowledgement Template (supports {'{{name}}, {{subject}}'})
          </label>
          <textarea
            rows={2}
            value={autoDraft.contactConfirmationTemplate}
            onChange={(e) =>
              setAutoDraft({ ...autoDraft, contactConfirmationTemplate: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={savingAuto}
          className="px-5 py-2 rounded-lg text-xs font-medium text-[#F8F6F1] cursor-pointer"
          style={{ backgroundColor: 'var(--brand-accent-deep)' }}
        >
          {savingAuto ? 'Saving...' : 'Save Automation Rules'}
        </button>
      </form>

      {/* Dispatched Communication Log */}
      <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-[#1E241E]">Automated Communication History</h3>
        {communications.length === 0 ? (
          <p className="text-sm text-[#5A6358]">No automated client messages sent yet.</p>
        ) : (
          <div className="divide-y divide-[#EFECE3]">
            {communications.map((c) => (
              <div key={c.id} className="py-3.5 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6358]">
                  <span className="font-semibold text-[#1E241E]">
                    {c.channel} · {c.recipientName} ({c.recipientEmail})
                  </span>
                  <span className="font-tabular">{c.sentAt.slice(0, 16).replace('T', ' ')}</span>
                </div>
                <p className="text-xs font-medium text-[#3F4F3B]">{c.subject}</p>
                <p className="text-sm text-[#4A5349]">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Contact Inquiries Panel                                                 */
/* -------------------------------------------------------------------------- */
export function InquiriesPanel({
  inquiries,
  onSaved,
  notify,
}: {
  inquiries: ContactInquiry[];
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const toggleRead = async (inq: ContactInquiry) => {
    try {
      await adminFetch(`/api/admin/inquiries/${inq.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: !inq.read }),
      });
      await onSaved();
      notify(inq.read ? 'Marked as unread.' : 'Marked as read.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update inquiry', true);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await adminFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      await onSaved();
      notify('Inquiry deleted.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete inquiry', true);
    }
  };

  return (
    <div className="space-y-4">
      {inquiries.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-10 text-center text-sm text-[#5A6358]">
          No contact form inquiries yet. Submissions from the Contact page will appear here.
        </div>
      ) : (
        inquiries.map((inq) => (
          <div
            key={inq.id}
            className={`bg-[#FFFFFF] border rounded-2xl p-6 space-y-3 ${
              inq.read ? 'border-[#E2DDD2]' : 'border-[#5E7059]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                  <span className="font-semibold text-[#1E241E]">
                    {inq.read ? 'Read' : 'Unread'}
                  </span>
                  <span>·</span>
                  <span className="font-tabular">{inq.createdAt.slice(0, 10)}</span>
                  <span>·</span>
                  <span>{inq.email}</span>
                  {inq.phone && (
                    <>
                      <span>·</span>
                      <span>{inq.phone}</span>
                    </>
                  )}
                </div>
                <h4 className="text-lg font-medium text-[#1E241E]">
                  {inq.subject} — {inq.name}
                </h4>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <a
                  href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject}`)}`}
                  className="font-semibold text-[#3F4F3B] hover:underline"
                >
                  Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => toggleRead(inq)}
                  className="font-semibold text-[#4A5349] hover:text-[#1E241E] cursor-pointer"
                >
                  {inq.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteInquiry(inq.id)}
                  className="font-semibold text-[#7A2727] hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#2C332B] whitespace-pre-line">
              {inq.message}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. SEO, Site Settings, Map, Legal & Security Panel                         */
/* -------------------------------------------------------------------------- */
export function SeoAndSettingsPanel({
  settings,
  seoPages,
  legal,
  onSaved,
  notify,
}: {
  settings: SiteSettings;
  seoPages: PageSeo[];
  legal: LegalPages;
  onSaved: () => Promise<void>;
  notify: (msg: string, isError?: boolean) => void;
}) {
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(settings);
  const [seoDraft, setSeoDraft] = useState<PageSeo[]>(seoPages);
  const [legalDraft, setLegalDraft] = useState<LegalPages>(legal);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const saveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsDraft),
      });
      await adminFetch('/api/admin/seo', {
        method: 'PUT',
        body: JSON.stringify(seoDraft),
      });
      await adminFetch('/api/admin/legal', {
        method: 'PUT',
        body: JSON.stringify(legalDraft),
      });
      await onSaved();
      notify('Site settings, SEO metadata, map location, and legal pages saved.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to save settings', true);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch('/api/admin/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword('');
      setNewPassword('');
      notify('Admin password updated.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update password', true);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={saveAllSettings} className="space-y-8">
        {/* Business Info & Map Location */}
        <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#1E241E]">
            Business Information &amp; Google Map Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Business Name</label>
              <input
                type="text"
                value={settingsDraft.businessName}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, businessName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Phone</label>
              <input
                type="text"
                value={settingsDraft.phone}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Email</label>
              <input
                type="email"
                value={settingsDraft.email}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Studio Address</label>
              <input
                type="text"
                value={settingsDraft.location.address}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    location: { ...settingsDraft.location, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={settingsDraft.location.lat}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    location: { ...settingsDraft.location, lat: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm font-tabular"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={settingsDraft.location.lng}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    location: { ...settingsDraft.location, lng: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm font-tabular"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div className="pt-2 space-y-2">
            <p className="text-xs font-semibold text-[#4A5349]">Business Hours</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {settingsDraft.businessHours.map((bh, idx) => (
                <div key={bh.day} className="p-2.5 rounded-lg bg-[#F8F6F1] border border-[#E2DDD2] space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{bh.day}</span>
                    <label className="inline-flex items-center gap-1 font-normal text-[#5A6358]">
                      <input
                        type="checkbox"
                        checked={Boolean(bh.closed)}
                        onChange={(e) => {
                          const next = [...settingsDraft.businessHours];
                          next[idx] = { ...bh, closed: e.target.checked };
                          setSettingsDraft({ ...settingsDraft, businessHours: next });
                        }}
                      />
                      Closed
                    </label>
                  </div>
                  <input
                    type="text"
                    value={bh.hours}
                    onChange={(e) => {
                      const next = [...settingsDraft.businessHours];
                      next[idx] = { ...bh, hours: e.target.value };
                      setSettingsDraft({ ...settingsDraft, businessHours: next });
                    }}
                    className="w-full px-2 py-1 rounded bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Colors, Logo, Favicon & Section Visibility */}
        <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#1E241E]">
            Branding, Colors &amp; Section Visibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={settingsDraft.logoUrl}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, logoUrl: e.target.value })}
              placeholder="Custom Logo Image URL (optional)"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
            <input
              type="text"
              value={settingsDraft.faviconUrl}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, faviconUrl: e.target.value })}
              placeholder="Custom Favicon URL (optional)"
              className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            {(
              [
                ['canvas', 'Canvas'],
                ['surface', 'Surface'],
                ['ink', 'Text Ink'],
                ['accent', 'Sage Accent'],
                ['accentDeep', 'Deep Accent'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="inline-flex items-center gap-2 text-xs text-[#4A5349]">
                <input
                  type="color"
                  value={settingsDraft.brandColors[key]}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      brandColors: { ...settingsDraft.brandColors, [key]: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-[#D8D2C5]"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EFECE3]">
            <p className="text-xs font-semibold text-[#4A5349] mb-2">
              Enable / Disable Home Sections
            </p>
            <div className="flex flex-wrap gap-5 text-xs">
              {(
                [
                  ['philosophy', 'Philosophy'],
                  ['services', 'Featured Services'],
                  ['whyChooseUs', 'Why Choose Us'],
                  ['transformation', 'Transformation'],
                  ['testimonials', 'Testimonials'],
                  ['finalCta', 'Final CTA'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={settingsDraft.sectionToggles[key]}
                    onChange={(e) =>
                      setSettingsDraft({
                        ...settingsDraft,
                        sectionToggles: {
                          ...settingsDraft.sectionToggles,
                          [key]: e.target.checked,
                        },
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-3 border-t border-[#EFECE3] space-y-2">
            <p className="text-xs font-semibold text-[#4A5349]">Social Links</p>
            <div className="space-y-2">
              {settingsDraft.socialLinks.map((soc, idx) => (
                <div key={soc.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={soc.label}
                    onChange={(e) => {
                      const next = [...settingsDraft.socialLinks];
                      next[idx] = { ...soc, label: e.target.value };
                      setSettingsDraft({ ...settingsDraft, socialLinks: next });
                    }}
                    className="col-span-3 px-2.5 py-1.5 rounded-lg border border-[#D8D2C5] text-xs"
                  />
                  <input
                    type="url"
                    value={soc.url}
                    onChange={(e) => {
                      const next = [...settingsDraft.socialLinks];
                      next[idx] = { ...soc, url: e.target.value };
                      setSettingsDraft({ ...settingsDraft, socialLinks: next });
                    }}
                    className="col-span-7 px-2.5 py-1.5 rounded-lg border border-[#D8D2C5] text-xs"
                  />
                  <label className="col-span-2 inline-flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={soc.enabled}
                      onChange={(e) => {
                        const next = [...settingsDraft.socialLinks];
                        next[idx] = { ...soc, enabled: e.target.checked };
                        setSettingsDraft({ ...settingsDraft, socialLinks: next });
                      }}
                    />
                    Active
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-Page SEO Editor */}
        <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-medium text-[#1E241E]">Page SEO &amp; OpenGraph Metadata</h3>
            <div className="flex items-center gap-4 text-xs text-[#3F4F3B]">
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline">
                View sitemap.xml
              </a>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="underline">
                View robots.txt
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {seoDraft.map((page, idx) => (
              <div key={page.path} className="p-4 rounded-xl bg-[#F8F6F1]/70 border border-[#E2DDD2] space-y-2.5">
                <p className="text-xs font-semibold text-[#1E241E]">
                  {page.label} ({page.path})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={page.title}
                    onChange={(e) => {
                      const next = [...seoDraft];
                      next[idx] = { ...page, title: e.target.value };
                      setSeoDraft(next);
                    }}
                    placeholder="Meta Title"
                    className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
                  />
                  <input
                    type="text"
                    value={page.keywords}
                    onChange={(e) => {
                      const next = [...seoDraft];
                      next[idx] = { ...page, keywords: e.target.value };
                      setSeoDraft(next);
                    }}
                    placeholder="Keywords"
                    className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={page.description}
                  onChange={(e) => {
                    const next = [...seoDraft];
                    next[idx] = { ...page, description: e.target.value };
                    setSeoDraft(next);
                  }}
                  placeholder="Meta Description"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Legal Pages Editor */}
        <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-[#1E241E]">Privacy Policy &amp; Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">Privacy Policy Content</label>
              <textarea
                rows={6}
                value={legalDraft.privacyPolicy.content}
                onChange={(e) =>
                  setLegalDraft({
                    ...legalDraft,
                    privacyPolicy: { ...legalDraft.privacyPolicy, content: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5349]">
                Terms &amp; Conditions Content
              </label>
              <textarea
                rows={6}
                value={legalDraft.termsAndConditions.content}
                onChange={(e) =>
                  setLegalDraft({
                    ...legalDraft,
                    termsAndConditions: {
                      ...legalDraft.termsAndConditions,
                      content: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C5] text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg text-sm font-medium text-[#F8F6F1] cursor-pointer"
          style={{ backgroundColor: 'var(--brand-accent-deep)' }}
        >
          {saving ? 'Saving Settings...' : 'Save All Site Settings & SEO'}
        </button>
      </form>

      {/* Change Admin Password */}
      <form
        onSubmit={changePassword}
        className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 space-y-4 max-w-xl"
      >
        <h3 className="text-lg font-medium text-[#1E241E]">Update Admin Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password (min. 6 chars)"
            className="px-3 py-2 rounded-lg border border-[#D8D2C5] text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-xs font-medium bg-[#F0ECE3] text-[#1E241E] hover:bg-[#E2DDD2] cursor-pointer"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { StudioMap } from '../components/StudioMap';
import { formatPhoneDisplay, useSite } from '../context/SiteContext';
import type { CommunicationLog } from '../types/cms';

export function ContactPage() {
  const { siteData, mapsApiKey, openBookingModal } = useSite();
  const { settings } = siteData;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReply, setSubmittedReply] = useState<CommunicationLog | null>(null);

  const activeSocials = settings.socialLinks.filter((s) => s.enabled && s.url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in your name, email, subject, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to send your message right now.');
      } else {
        setSubmittedReply(data.autoReply || null);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setError('Network error while sending your message. Please call or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="py-16 md:py-22 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[#5E7059]">Contact &amp; Visit</p>
            <h1
              className="text-4xl sm:text-5xl font-normal leading-[1.1] text-[#1E241E]"
              style={{ textWrap: 'balance' }}
            >
              Begin a calm, unhurried conversation.
            </h1>
            <p className="text-base sm:text-lg text-[#5A6358] leading-relaxed">
              Reach out with questions about individual sessions, personal development coaching, or
              group workshops. We respond personally within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 md:py-24 bg-[#F0ECE3]/45 border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Form Column */}
          <Reveal className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1E241E]">
                Send an Inquiry
              </h2>
              <p className="text-sm text-[#5A6358]">
                Prefer to choose a specific time slot?{' '}
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="font-semibold text-[#3F4F3B] underline underline-offset-4 hover:text-[#1E241E] cursor-pointer"
                >
                  Book a session directly
                </button>
                .
              </p>
            </div>

            {submittedReply && (
              <div
                role="status"
                className="p-5 rounded-xl bg-[#F0ECE3]/75 border border-[#C9D2C4] space-y-2"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3F4F3B]">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>Message Received &amp; Automated Acknowledgement Sent</span>
                </div>
                <p className="text-sm text-[#2C332B] leading-relaxed">{submittedReply.body}</p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-[#FDF2F2] border border-[#E5B8B8] text-sm text-[#7A2727]"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#4A5349]">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#4A5349]">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#4A5349]">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(604) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#4A5349]">
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Session inquiry, workshop, etc."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#4A5349]">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what kind of support or session you are looking for..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-lg text-sm font-medium text-[#F8F6F1] disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: 'var(--brand-accent-deep)' }}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Reveal>

          {/* Direct Details & Hours Column */}
          <Reveal delay={0.08} className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-2xl font-normal text-[#1E241E]">Direct Contact</h2>

              <div className="space-y-4 text-sm">
                <a
                  href={`tel:${settings.phone.replace(/\D/g, '')}`}
                  className="flex items-start gap-3 text-[#2C332B] hover:text-[#3F4F3B] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#5E7059] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#5A6358]">Phone (Click to Call)</p>
                    <p className="font-medium">{formatPhoneDisplay(settings.phone)}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3 text-[#2C332B] hover:text-[#3F4F3B] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#5E7059] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#5A6358]">Email</p>
                    <p className="font-medium">{settings.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-[#2C332B]">
                  <MapPin className="w-4 h-4 text-[#5E7059] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#5A6358]">Location</p>
                    <p className="font-medium">{settings.location.address}</p>
                    <p className="text-xs text-[#5A6358]">
                      {settings.location.city}, {settings.location.region}
                    </p>
                  </div>
                </div>
              </div>

              {activeSocials.length > 0 && (
                <div className="pt-4 border-t border-[#EFECE3] flex flex-wrap items-center gap-4 text-xs font-medium text-[#3F4F3B]">
                  {activeSocials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-[#1E241E]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5E7059]" aria-hidden="true" />
                <h2 className="text-2xl font-normal text-[#1E241E]">Business Hours</h2>
              </div>
              <dl className="divide-y divide-[#EFECE3] text-sm">
                {settings.businessHours.map((row) => (
                  <div key={row.day} className="py-2.5 flex items-center justify-between gap-4">
                    <dt className="text-[#4A5349] font-medium">{row.day}</dt>
                    <dd
                      className={`font-tabular text-xs sm:text-sm ${
                        row.closed ? 'text-[#8C9288]' : 'text-[#1E241E]'
                      }`}
                    >
                      {row.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive Google Map */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#5E7059]">Sanctuary Map</p>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1E241E]">
                {settings.location.markerLabel}
              </h2>
            </div>
            <p className="text-sm text-[#5A6358]">
              {settings.location.address} · {settings.location.city}, {settings.location.region}
            </p>
          </div>
          <StudioMap apiKey={mapsApiKey} location={settings.location} />
        </div>
      </section>
    </div>
  );
}

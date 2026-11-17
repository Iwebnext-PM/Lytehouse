import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Download, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { AppointmentBooking, CommunicationLog } from '../types/cms';

interface SlotOption {
  time: string;
  available: boolean;
}

function getDefaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function downloadIcsFile(booking: AppointmentBooking, businessName: string) {
  const cleanDate = booking.date.replace(/-/g, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lyte House Collective//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@lytehousecollective.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `SUMMARY:${booking.serviceTitle} – ${businessName}`,
    `DESCRIPTION:Confirmation ${booking.confirmationCode} | Format: ${booking.format} | Time: ${booking.timeSlot}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lyte-house-${booking.confirmationCode}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function BookingModal() {
  const { siteData, bookingOpen, preselectedServiceId, closeBookingModal } = useSite();
  const activeServices = siteData.services.filter((s) => s.active);

  const [serviceId, setServiceId] = useState<string>('');
  const [date, setDate] = useState<string>(getDefaultDate);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [format, setFormat] = useState<'In-Person Sanctuary' | 'Virtual Session'>(
    'In-Person Sanctuary'
  );
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedResult, setConfirmedResult] = useState<{
    booking: AppointmentBooking;
    confirmation: CommunicationLog;
  } | null>(null);

  useEffect(() => {
    if (bookingOpen) {
      setConfirmedResult(null);
      setError(null);
      if (preselectedServiceId && activeServices.some((s) => s.id === preselectedServiceId)) {
        setServiceId(preselectedServiceId);
      } else if (!serviceId && activeServices.length > 0) {
        setServiceId(activeServices[0].id);
      }
    }
  }, [bookingOpen, preselectedServiceId, activeServices, serviceId]);

  useEffect(() => {
    if (!bookingOpen || !date) return;
    setLoadingSlots(true);
    fetch(`/api/bookings/slots?date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((data: { slots?: SlotOption[] }) => {
        const list = data.slots || [];
        setSlots(list);
        const firstAvailable = list.find((s) => s.available);
        setTimeSlot((prev) =>
          list.some((s) => s.time === prev && s.available)
            ? prev
            : firstAvailable?.time || ''
        );
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [bookingOpen, date]);

  if (!bookingOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!serviceId || !date || !timeSlot || !clientName.trim() || !clientEmail.trim()) {
      setError('Please select a session, date, time slot, and enter your name and email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          date,
          timeSlot,
          format,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not complete booking. Please try again.');
      } else {
        setConfirmedResult({
          booking: data.booking,
          confirmation: data.confirmation,
        });
      }
    } catch {
      setError('Network error while scheduling. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E241E]/45 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#F8F6F1] border border-[#E2DDD2] rounded-2xl shadow-xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD2] bg-[#F0ECE3]/60">
          <div>
            <p className="text-xs font-medium text-[#5E7059]">Appointment Scheduling</p>
            <h2
              id="booking-modal-title"
              className="text-2xl font-medium text-[#1E241E]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {confirmedResult ? 'Your Session Is Scheduled' : 'Book a Session'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            aria-label="Close booking dialog"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#E2DDD2] text-[#4A5349] hover:text-[#1E241E] hover:bg-[#F0ECE3] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedResult ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#FFFFFF] border border-[#E2DDD2]">
              <CheckCircle2 className="w-6 h-6 text-[#3F4F3B] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6358]">
                  <span className="font-semibold text-[#1E241E]">
                    Code: {confirmedResult.booking.confirmationCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Status: {confirmedResult.booking.status}</span>
                </div>
                <p className="text-base font-medium text-[#1E241E]">
                  {confirmedResult.booking.serviceTitle}
                </p>
                <p className="text-sm text-[#4A5349]">
                  {confirmedResult.booking.date} at {confirmedResult.booking.timeSlot} ·{' '}
                  {confirmedResult.booking.format}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#5A6358]">
                Automated Client Confirmation Sent
              </p>
              <div className="p-4 rounded-xl bg-[#F0ECE3]/70 border border-[#E2DDD2] text-sm text-[#1E241E] leading-relaxed">
                <p className="text-xs text-[#5A6358] mb-1">
                  To: {confirmedResult.confirmation.recipientEmail} ·{' '}
                  {confirmedResult.confirmation.subject}
                </p>
                <p>{confirmedResult.confirmation.body}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  downloadIcsFile(confirmedResult.booking, siteData.settings.businessName)
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#D4CEC0] text-[#1E241E] hover:bg-[#F0ECE3] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Add to Calendar (.ics)
              </button>
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-5 py-2.5 text-sm font-medium text-[#F8F6F1] rounded-lg cursor-pointer"
                style={{ backgroundColor: 'var(--brand-accent-deep)' }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-sm text-[#7A2727]"
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="booking-service" className="block text-xs font-semibold text-[#4A5349]">
                Select Offering
              </label>
              <select
                id="booking-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
              >
                {activeServices.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} ({srv.duration})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="booking-date" className="block text-xs font-semibold text-[#4A5349]">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#5A6358] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-date"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-[#4A5349]">Session Format</span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EFECE3] rounded-lg border border-[#E2DDD2]">
                  {(['In-Person Sanctuary', 'Virtual Session'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormat(option)}
                      className={`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        format === option
                          ? 'bg-[#FFFFFF] text-[#1E241E] shadow-xs'
                          : 'text-[#5A6358] hover:text-[#1E241E]'
                      }`}
                    >
                      {option === 'In-Person Sanctuary' ? 'In-Person' : 'Virtual'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4A5349]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Available Times
              </span>
              {loadingSlots ? (
                <p className="text-xs text-[#5A6358] py-2">Checking schedule availability...</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setTimeSlot(slot.time)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                        !slot.available
                          ? 'bg-[#F0ECE3] border-[#E2DDD2] text-[#9EA49C] line-through cursor-not-allowed'
                          : timeSlot === slot.time
                            ? 'bg-[#3F4F3B] border-[#3F4F3B] text-[#F8F6F1] cursor-pointer'
                            : 'bg-[#FFFFFF] border-[#D8D2C5] text-[#1E241E] hover:border-[#5E7059] cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="booking-name" className="block text-xs font-semibold text-[#4A5349]">
                  Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="booking-email" className="block text-xs font-semibold text-[#4A5349]">
                  Email Address *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="booking-phone" className="block text-xs font-semibold text-[#4A5349]">
                  Phone Number
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(604) 555-0199"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="booking-notes" className="block text-xs font-semibold text-[#4A5349]">
                  Intention or Focus (Optional)
                </label>
                <input
                  id="booking-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What brings you here today?"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-4 py-2.5 text-sm font-medium text-[#5A6358] hover:text-[#1E241E] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !timeSlot}
                className="px-6 py-2.5 text-sm font-medium text-[#F8F6F1] rounded-lg disabled:opacity-50 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'var(--brand-accent-deep)' }}
              >
                {submitting ? 'Scheduling...' : 'Confirm Session'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

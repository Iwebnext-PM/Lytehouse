import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { setStoredAdminToken } from './adminApi';

interface AdminAuthGateProps {
  configured: boolean;
  defaultEmail: string;
  onAuthenticated: () => void;
}

export function AdminAuthGate({
  configured,
  defaultEmail,
  onAuthenticated,
}: AdminAuthGateProps) {
  const { siteData, navigate } = useSite();
  const [email, setEmail] = useState(defaultEmail || siteData.settings.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!configured && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = configured ? '/api/auth/login' : '/api/auth/setup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = (await res.json()) as {
        authenticated?: boolean;
        token?: string;
        error?: string;
      };
      if (!res.ok || !data.authenticated) {
        setError(data.error || 'Authentication failed.');
      } else {
        if (data.token) {
          setStoredAdminToken(data.token);
        }
        onAuthenticated();
      }
    } catch {
      setError('Unable to reach authentication server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2DDD2] rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F0ECE3] border border-[#E2DDD2] flex items-center justify-center text-[#3F4F3B]">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold tracking-wider text-[#5E7059]">
            {siteData.settings.businessName}
          </p>
          <h1
            className="text-3xl font-normal text-[#1E241E]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {configured ? 'Admin Sign In' : 'Initialize Owner Access'}
          </h1>
          <p className="text-sm text-[#5A6358]">
            {configured
              ? 'Sign in to manage website content, services, bookings, and inquiries.'
              : 'Create your secure owner password to unlock the website management dashboard.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-sm text-[#7A2727]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-semibold text-[#4A5349]">
              Owner Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-semibold text-[#4A5349]">
              {configured ? 'Password' : 'Create Password (min. 6 characters)'}
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
            />
          </div>

          {!configured && (
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password-confirm"
                className="block text-xs font-semibold text-[#4A5349]"
              >
                Confirm Password
              </label>
              <input
                id="admin-password-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F6F1] border border-[#D8D2C5] text-sm text-[#1E241E] focus:outline-none focus:ring-2 focus:ring-[#5E7059]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg text-sm font-medium text-[#F8F6F1] disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: 'var(--brand-accent-deep)' }}
          >
            {submitting
              ? 'Verifying...'
              : configured
                ? 'Sign In to Dashboard'
                : 'Set Password & Enter Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#EFECE3] flex items-center justify-between text-xs text-[#5A6358]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 hover:text-[#1E241E] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
}

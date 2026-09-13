import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api('/auth/forgot-password', { method: 'POST', body: { email } });
      setDone(true); // Always shown, whether or not the email exists — see backend note.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04]">
        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-forest mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold mb-2 text-ink">Check your email</h1>
            <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
              If an account exists for <span className="font-semibold text-ink">{email}</span>, a secure password reset link has been sent. It expires in 1 hour.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-200">
                Self-Service Recovery
              </span>
              <h1 className="font-display text-2xl font-semibold mt-2 mb-1 text-ink">Reset password</h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Enter your registered email address to receive recovery instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                />
              </div>

              {error && (
                <div className="text-xs text-rust bg-rust/5 border border-rust/20 rounded-xl p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 text-rust shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending link…</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </form>

            <div className="bg-[#F5EFE1]/70 border border-ink/10 rounded-xl p-3.5 mt-5 text-[11px] text-ink-soft leading-relaxed">
              💡 <strong>No email linked?</strong> Orange Health reception can reset your credentials in person at the clinic desk.
            </div>

            <div className="border-t border-ink/10 mt-6 pt-5 text-center">
              <Link to="/login" className="text-xs text-forest font-semibold hover:underline">
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

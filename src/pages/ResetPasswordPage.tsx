import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, newPassword } });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. This link may have expired.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04]">
        {!token ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-rust/10 text-rust mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-semibold mb-2 text-ink">Invalid Link</h1>
            <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
              This reset link is missing its security token or has already been used. Please request a new link.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all"
            >
              Request New Reset Link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-forest mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold mb-2 text-ink">Password updated</h1>
            <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="font-display text-2xl font-semibold mb-1 text-ink">Set new password</h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Choose a strong password with at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2.5 pr-10 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-soft hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
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
                    <span>Saving new password…</span>
                  </>
                ) : (
                  <span>Set New Password</span>
                )}
              </button>
            </form>

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

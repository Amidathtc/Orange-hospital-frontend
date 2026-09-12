import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
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
      {!token ? (
            <p className="text-sm text-rust">
              This link is missing its reset token. Request a new one from the sign-in page.
            </p>
          ) : done ? (
            <>
              <h1 className="font-display text-xl font-semibold mb-2">Password updated</h1>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 mt-3"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display text-xl font-semibold mb-1">Set a new password</h1>
              <form onSubmit={handleSubmit} className="space-y-3 mt-5">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
                />
                {error && <div className="text-sm text-rust">{error}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Set new password'}
                </button>
              </form>
            </>
          )}
    </AuthLayout>
  );
}

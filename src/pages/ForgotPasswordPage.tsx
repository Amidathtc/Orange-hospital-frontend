import { useState } from 'react';
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
      {done ? (
            <>
              <h1 className="font-display text-xl font-semibold mb-2">Check your email</h1>
              <p className="text-sm text-ink-soft">
                If an account exists for {email}, a reset link is on its way. It expires in an hour.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-xl font-semibold mb-1">Reset your password</h1>
              <p className="text-sm text-ink-soft mb-6">
                We'll email you a link to set a new one.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
                />
                {error && <div className="text-sm text-rust">{error}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}

      <p className="text-center text-xs text-ink-soft mt-6">
        <a href="/login" className="text-forest font-semibold">
          Back to sign in
        </a>
      </p>
    </AuthLayout>
  );
}

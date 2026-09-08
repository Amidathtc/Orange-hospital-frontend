import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';

export function VerifyEmailPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setStatus('error');
      setError('This link is missing its verification token.');
      return;
    }
    api('/auth/verify-email', { method: 'POST', body: { token } })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setError(err instanceof ApiError ? err.message : 'Could not verify this link.');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-full bg-rust relative">
            <div className="absolute inset-[3px] rounded-full border-2 border-paper" />
          </div>
          <span className="font-display font-semibold text-lg">
            Orange Health <span className="text-rust">Ajo</span>
          </span>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-7">
          {status === 'checking' && <p className="text-sm text-ink-soft">Verifying…</p>}
          {status === 'success' && (
            <>
              <h1 className="font-display text-xl font-semibold mb-2">Email verified</h1>
              <a href="/login" className="text-forest font-semibold text-sm">
                Continue to sign in
              </a>
            </>
          )}
          {status === 'error' && <p className="text-sm text-rust">{error}</p>}
        </div>
      </div>
    </div>
  );
}

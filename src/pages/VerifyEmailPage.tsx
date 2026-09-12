import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

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
    <AuthLayout>
      <div className="text-center">
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
    </AuthLayout>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        setError(err instanceof ApiError ? err.message : 'Could not verify this link. It may have expired.');
      });
  }, []);

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04] text-center">
        {status === 'checking' && (
          <div className="py-8">
            <svg className="animate-spin h-8 w-8 text-forest mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h2 className="font-display text-lg font-semibold text-ink mb-1">Verifying your email</h2>
            <p className="text-xs text-ink-soft">Please wait a moment…</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-forest mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold mb-2 text-ink">Email verified!</h1>
            <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
              Your email address has been verified. You now have full access to online recovery and digital receipts.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all"
            >
              Continue to Sign In
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="w-14 h-14 rounded-full bg-rust/10 text-rust mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold mb-2 text-ink">Verification Failed</h1>
            <p className="text-xs sm:text-sm text-rust mb-6 leading-relaxed">
              {error}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-forest/20 transition-all"
            >
              Return to Sign In
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

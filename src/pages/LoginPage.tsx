import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, automatically redirect to their authorized portal
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'RECEPTIONIST') navigate('/reception', { replace: true });
      else navigate('/member', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(phone, password);
      redirectByRole();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Invalid phone number or password. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function redirectByRole() {
    const stored = localStorage.getItem('oha_user');
    const role = stored ? JSON.parse(stored).role : null;
    if (role === 'ADMIN') navigate('/admin', { replace: true });
    else if (role === 'RECEPTIONIST') navigate('/reception', { replace: true });
    else navigate('/member', { replace: true });
  }

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            Sign in to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Phone number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-soft/60 text-xs font-mono">
                🇳🇬 +234
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-20 pr-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                placeholder="0803 123 4567"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-forest hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                placeholder="••••••••"
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
            className="w-full bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl py-3 mt-1 shadow-lg shadow-forest/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer actions */}
        <div className="border-t border-ink/10 mt-6 pt-5 text-center">
          <p className="text-xs text-ink-soft">
            New member?{' '}
            <Link to="/signup" className="text-forest font-semibold hover:underline">
              Join the Ajo & Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

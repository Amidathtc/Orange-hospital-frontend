import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

type LoginRole = 'MEMBER' | 'RECEPTIONIST' | 'ADMIN';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<LoginRole>('MEMBER');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(phone, password);
      redirectByRole();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid credentials. Please check your phone number and password.');
    } finally {
      setSubmitting(false);
    }
  }

  function redirectByRole() {
    const stored = localStorage.getItem('oha_user');
    const role = stored ? JSON.parse(stored).role : null;
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'RECEPTIONIST') navigate('/reception');
    else navigate('/member');
  }

  const roleMeta = {
    MEMBER: {
      badge: 'Member Portal',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      title: 'Welcome back',
      subtitle: 'Sign in to access your savings passbook & healthcare ajo.',
      btnText: 'Sign in as Member',
      btnColor: 'bg-forest hover:bg-forest-light text-white shadow-forest/20',
      phonePlaceholder: '0803 123 4567',
    },
    RECEPTIONIST: {
      badge: 'Reception Desk',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
      title: 'Staff Reception',
      subtitle: 'Record member contributions, assist resets, and verify patients.',
      btnText: 'Sign in to Reception Desk',
      btnColor: 'bg-[#2E6B54] hover:bg-forest text-white shadow-emerald-900/20',
      phonePlaceholder: 'Staff phone number',
    },
    ADMIN: {
      badge: 'Hospital Admin',
      badgeColor: 'bg-orange-50 text-rust border-rust/20',
      title: 'Administration',
      subtitle: 'Oversee community funds, approve claims, and manage clinic staff.',
      btnText: 'Sign in to Admin Console',
      btnColor: 'bg-rust hover:bg-rust-dark text-white shadow-rust/20',
      phonePlaceholder: 'Admin phone number',
    },
  };

  const current = roleMeta[selectedRole];

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04]">
        {/* Role Routine Selector Tabs */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/70 mb-2">
            Select Your Portal
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#F5EFE1]/70 p-1 rounded-xl border border-ink/10">
            <button
              type="button"
              onClick={() => { setSelectedRole('MEMBER'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'MEMBER'
                  ? 'bg-white text-forest shadow-sm border border-ink/10'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Member</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('RECEPTIONIST'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'RECEPTIONIST'
                  ? 'bg-white text-emerald-800 shadow-sm border border-ink/10'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Reception</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('ADMIN'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-rust shadow-sm border border-ink/10'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Header with dynamic role badge */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h1 className="font-display text-2xl font-semibold text-ink">
              {current.title}
            </h1>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        {/* Staff / Admin Notice Banner */}
        {selectedRole !== 'MEMBER' && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[12px] text-amber-950 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold">Hospital Staff Notice:</span> Use your assigned phone number and temporary/set password.
            </div>
          </div>
        )}

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
                placeholder={current.phonePlaceholder}
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
            className={`w-full font-semibold text-sm rounded-xl py-3 mt-1 shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 ${current.btnColor}`}
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
              <span>{current.btnText}</span>
            )}
          </button>
        </form>

        {/* Footer actions depending on role */}
        <div className="border-t border-ink/10 mt-6 pt-5 text-center">
          {selectedRole === 'MEMBER' ? (
            <p className="text-xs text-ink-soft">
              New member?{' '}
              <Link to="/signup" className="text-forest font-semibold hover:underline">
                Join the Ajo & Create an account
              </Link>
            </p>
          ) : (
            <p className="text-xs text-ink-soft">
              Staff accounts are created by Hospital Admin.{' '}
              <button
                type="button"
                onClick={() => setSelectedRole('MEMBER')}
                className="text-forest font-semibold hover:underline"
              >
                Switch to Member Login
              </button>
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

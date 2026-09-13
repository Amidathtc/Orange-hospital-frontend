import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

type SignupTab = 'MEMBER' | 'RECEPTIONIST' | 'ADMIN';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SignupTab>('MEMBER');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(fullName, phone, email, password);
      navigate('/member');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-ink/[0.04]">
        {/* Role Selector Tabs */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/70 mb-2">
            Account Type
          </div>
          <div className="grid grid-cols-3 gap-1 bg-[#F5EFE1]/70 p-1 rounded-xl border border-ink/10">
            <button
              type="button"
              onClick={() => { setActiveTab('MEMBER'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'MEMBER'
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
              onClick={() => { setActiveTab('RECEPTIONIST'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'RECEPTIONIST'
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
              onClick={() => { setActiveTab('ADMIN'); setError(null); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'ADMIN'
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

        {/* TAB 1: MEMBER PUBLIC SIGNUP */}
        {activeTab === 'MEMBER' && (
          <div>
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h1 className="font-display text-2xl font-semibold text-ink">Join the ajo</h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                  Instant Access
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Save daily or weekly. Receive medical care coverage and cash returns.
              </p>
            </div>

            {/* Fund automatic setup preview banner */}
            <div className="mb-5 p-3 rounded-xl bg-forest/5 border border-forest/15">
              <div className="text-[11px] font-semibold text-forest uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                2 Funds Provisioned Automatically
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 border border-forest/10 p-2 rounded-lg">
                  <div className="font-semibold text-forest">🏥 Health Ajo</div>
                  <div className="text-ink-soft/80 text-[11px]">Subsidized medical bills</div>
                </div>
                <div className="bg-white/80 border border-rust/10 p-2 rounded-lg">
                  <div className="font-semibold text-rust">💰 General Ajo</div>
                  <div className="text-ink-soft/80 text-[11px]">Emergency cash draws</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                  placeholder="e.g. Mrs. Adeyemi Olufunke"
                />
              </div>

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
                    Email address
                  </label>
                  <span className="text-[11px] text-ink-soft/70">Optional</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                  placeholder="you@example.com"
                />
                <p className="text-[11px] text-ink-soft/70 mt-1">
                  Enables online password reset and digital receipts. (You can also reset via reception).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all placeholder:text-ink-soft/40"
                    placeholder="At least 6 characters"
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
                    <span>Setting up account…</span>
                  </>
                ) : (
                  <span>Create Member Account</span>
                )}
              </button>
            </form>

            <div className="border-t border-ink/10 mt-6 pt-5 text-center">
              <p className="text-xs text-ink-soft">
                Already registered?{' '}
                <Link to="/login" className="text-forest font-semibold hover:underline">
                  Sign in to your account
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: RECEPTIONIST GUIDED ROUTINE */}
        {activeTab === 'RECEPTIONIST' && (
          <div className="py-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink mb-2">
              Staff Receptionist Setup
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mb-5">
              To safeguard community health funds, staff receptionist accounts cannot be created through public self-registration.
            </p>

            <div className="bg-[#F5EFE1]/70 border border-ink/10 rounded-xl p-4 space-y-3 mb-6">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-ink">
                  <strong>Issued by Administration:</strong> Your clinic administrator creates your staff profile directly inside the Admin portal.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-ink">
                  <strong>Temporary Password:</strong> You will receive your official phone number and a temporary password to sign in.
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/login"
                className="w-full bg-[#2E6B54] hover:bg-forest text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Reception Login</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab('MEMBER')}
                className="w-full border border-ink/15 text-ink-soft hover:text-ink font-semibold text-xs rounded-xl py-2.5 transition-all"
              >
                Back to Member Registration
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN GUIDED ROUTINE */}
        {activeTab === 'ADMIN' && (
          <div className="py-2">
            <div className="w-12 h-12 rounded-2xl bg-rust/10 border border-rust/20 text-rust flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h2 className="font-display text-2xl font-semibold text-ink mb-2">
              Hospital Administration Access
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mb-5">
              Administrator privileges provide complete oversight of member pools, contribution reconciliations, and hospital staff management.
            </p>

            <div className="bg-rust/5 border border-rust/15 rounded-xl p-4 space-y-3 mb-6">
              <div className="text-xs text-rust-dark font-medium leading-relaxed">
                🛡️ <strong>Restricted Access:</strong> New admin accounts must be provisioned internally by an existing Hospital Super Admin or system provisioning.
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/login"
                className="w-full bg-rust hover:bg-rust-dark text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-rust/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Admin Login</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab('MEMBER')}
                className="w-full border border-ink/15 text-ink-soft hover:text-ink font-semibold text-xs rounded-xl py-2.5 transition-all"
              >
                Back to Member Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

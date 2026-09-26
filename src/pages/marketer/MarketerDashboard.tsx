import { useEffect, useState, useCallback } from 'react';
import {
  Search, LogOut, UserPlus, Users, TrendingUp, Calendar,
  ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle, UserRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, ApiError } from '../../lib/api';
import { Greeting } from '../../components/Greeting';
import { Skeleton } from '../../components/Skeleton';
import { OrangeHospitalLogo, PoweredByOrangeHospital } from '../../components/OrangeHospitalLogo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalReferrals: number;
  thisMonth: number;
  thisWeek: number;
}

interface Referral {
  id: string;
  fullName: string;
  phone: string;
  registeredAt: string;
}

interface ReferralPage {
  data: Referral[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface MemberLookup {
  id: string;
  fullName: string;
  phone: string;
}

type Tab = 'register' | 'referrals' | 'stats';

const LIMIT = 10;

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function MarketerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('referrals');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6F0] via-paper to-[#F3ECE0]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-ink/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-ink/10 flex items-center justify-center shadow-xs">
            <OrangeHospitalLogo className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-semibold text-base tracking-tight text-ink">
              Orange Health <span className="text-rust">Ajo</span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/20">
              Marketer
            </span>
            <span className="hidden md:inline-block">
              <PoweredByOrangeHospital theme="light" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-ink-soft bg-ink/5 px-3 py-1.5 rounded-full border border-ink/5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{user?.fullName}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-rust transition-colors px-3 py-1.5 rounded-lg border border-ink/10 hover:border-rust/20 bg-white hover:bg-rust/5"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Greeting */}
        {user && <Greeting fullName={user.fullName} role="MARKETER" />}

        {/* Tab Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-white border border-ink/10 rounded-2xl shadow-xs">
          <TabBtn active={activeTab === 'referrals'} onClick={() => setActiveTab('referrals')} icon={<Users size={15} />} label="My Referrals" />
          <TabBtn active={activeTab === 'register'} onClick={() => setActiveTab('register')} icon={<UserPlus size={15} />} label="Register Member" />
          <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<TrendingUp size={15} />} label="My Stats" />
        </div>

        {activeTab === 'referrals' && <ReferralsTab />}
        {activeTab === 'register' && <RegisterMemberTab onSuccess={() => setActiveTab('referrals')} />}
        {activeTab === 'stats' && <StatsTab />}
      </main>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabBtn({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
        active ? 'bg-ink text-white shadow-sm' : 'text-ink-soft hover:text-ink hover:bg-ink/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Tab 1: Referrals (search + pagination) ───────────────────────────────────

function ReferralsTab() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReferralPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        sort: 'registeredAt',
        order: 'desc',
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      const data = await api<ReferralPage>(`/marketer/referrals?${params}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load referrals.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-ink/10 bg-paper/30 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Users size={18} className="text-amber-600" />
          <h3 className="font-semibold text-sm text-ink">My Referrals</h3>
          {result && (
            <span className="text-xs text-ink-soft ml-1">({result.meta.total} total)</span>
          )}
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-8 pr-8 py-2 border border-ink/15 rounded-lg text-xs focus:outline-none focus:border-amber-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-3 text-xs text-rust bg-rust/5 border-b border-rust/15 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="divide-y divide-ink/8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-ink/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-20 hidden sm:block" />
            </div>
          ))
        ) : result && result.data.length === 0 ? (
          <div className="px-6 py-14 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Users size={20} />
            </div>
            <div className="text-sm font-semibold text-ink">
              {debouncedSearch ? 'No results found' : 'No referrals yet'}
            </div>
            <div className="text-xs text-ink-soft">
              {debouncedSearch ? 'Try a different name or phone number.' : 'Register your first member to get started.'}
            </div>
          </div>
        ) : (
          result?.data.map((r) => (
            <div key={r.id} className="px-6 py-4 flex items-center gap-3 hover:bg-paper/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold">
                {r.fullName.trim()[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-ink truncate">{r.fullName}</div>
                <div className="text-xs text-ink-soft">{r.phone}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-ink-soft flex items-center gap-1 justify-end">
                  <Calendar size={11} />
                  {new Date(r.registeredAt).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {result && result.meta.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-ink/10 flex items-center justify-between">
          <span className="text-xs text-ink-soft">
            Page {result.meta.page} of {result.meta.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-ink/15 text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === result.meta.totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="text-xs text-ink-soft px-1">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      page === p
                        ? 'bg-ink text-white'
                        : 'border border-ink/15 text-ink-soft hover:text-ink hover:bg-ink/5'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(result.meta.totalPages, p + 1))}
              disabled={page === result.meta.totalPages}
              className="p-1.5 rounded-lg border border-ink/15 text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Register Member ───────────────────────────────────────────────────

function RegisterMemberTab({ onSuccess }: { onSuccess: () => void }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Duplicate check state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<MemberLookup[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Debounced duplicate lookup on phone input
  useEffect(() => {
    if (phone.length < 7) { setLookupResults([]); return; }
    const t = setTimeout(async () => {
      setLookupLoading(true);
      try {
        const res = await api<{ data: MemberLookup[] }>(`/marketer/members?search=${encodeURIComponent(phone)}&limit=5`);
        setLookupResults(res.data);
      } catch {
        setLookupResults([]);
      } finally {
        setLookupLoading(false);
      }
    }, 400);
    setLookupQuery(phone);
    return () => clearTimeout(t);
  }, [phone]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await api('/marketer/register-member', {
        method: 'POST',
        body: { fullName, phone },
      });
      setSuccess(`${fullName} has been registered successfully.`);
      setFullName('');
      setPhone('');
      setLookupResults([]);
      setTimeout(onSuccess, 1800);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not register this member.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-ink/10 bg-paper/30 flex items-center gap-2">
        <UserPlus size={18} className="text-amber-600" />
        <h3 className="font-semibold text-sm text-ink">Register New Member</h3>
      </div>

      <div className="px-6 py-6 max-w-md">
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
              <CheckCircle size={22} />
            </div>
            <div className="font-semibold text-sm text-ink">{success}</div>
            <div className="text-xs text-ink-soft">Redirecting to your referrals…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Amaka Okonkwo"
                className="w-full px-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Phone number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-soft/60 text-xs font-mono">
                  🇳🇬 +234
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full pl-20 pr-3 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                />
              </div>

              {/* Duplicate check results */}
              {lookupQuery.length >= 7 && (
                <div className="mt-2">
                  {lookupLoading ? (
                    <div className="text-xs text-ink-soft">Checking for existing accounts…</div>
                  ) : lookupResults.length > 0 ? (
                    <div className="border border-amber-400/40 bg-amber-50 rounded-xl p-3 space-y-2">
                      <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                        <AlertCircle size={13} />
                        Possible existing accounts found — double check before registering:
                      </div>
                      {lookupResults.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-xs text-amber-800">
                          <UserRound size={13} />
                          <span className="font-medium">{m.fullName}</span>
                          <span className="text-amber-600">{m.phone}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-forest flex items-center gap-1.5 mt-1">
                      <CheckCircle size={13} /> No existing account found — safe to register.
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="text-xs text-rust bg-rust/5 border border-rust/20 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl py-3 mt-1 shadow-lg shadow-amber-600/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering…</span>
                </>
              ) : (
                <span>Register Member</span>
              )}
            </button>

            <p className="text-[11px] text-ink-soft text-center leading-relaxed">
              The new member will receive a message to set their password and access their account.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Tab 3: Stats ─────────────────────────────────────────────────────────────

function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Stats>('/marketer/stats')
      .then(setStats)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : error ? (
          <div className="col-span-3 text-sm text-rust text-center py-8">{error}</div>
        ) : stats ? (
          <>
            <StatCard
              icon={Users}
              label="Total Referrals"
              value={String(stats.totalReferrals)}
              subtitle="All time"
              accentColor="border-l-amber-500"
              iconBg="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={Calendar}
              label="This Month"
              value={String(stats.thisMonth)}
              subtitle="New members registered"
              accentColor="border-l-forest"
              iconBg="bg-forest/10 text-forest"
            />
            <StatCard
              icon={TrendingUp}
              label="This Week"
              value={String(stats.thisWeek)}
              subtitle="Recent registrations"
              accentColor="border-l-indigo-500"
              iconBg="bg-indigo-50 text-indigo-600"
            />
          </>
        ) : null}
      </div>

      {stats && (
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-4">Activity breakdown</div>
          <div className="space-y-3">
            <ProgressRow label="This week" value={stats.thisWeek} max={stats.totalReferrals} color="bg-indigo-500" />
            <ProgressRow label="This month" value={stats.thisMonth} max={stats.totalReferrals} color="bg-forest" />
            <ProgressRow label="All time" value={stats.totalReferrals} max={stats.totalReferrals} color="bg-amber-500" />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-ink-soft font-medium">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, subtitle, accentColor, iconBg,
}: {
  icon: typeof Users; label: string; value: string; subtitle: string; accentColor: string; iconBg: string;
}) {
  return (
    <div className={`bg-white border border-ink/10 border-l-4 ${accentColor} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-ink mb-1">{value}</div>
      <div className="text-[11px] text-ink-soft/70">{subtitle}</div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-xs">
      <Skeleton className="h-3.5 w-24 mb-3" />
      <Skeleton className="h-7 w-16 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

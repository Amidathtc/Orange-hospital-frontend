import { useEffect, useState } from 'react';
import { Users, Wallet, Heart, LogOut, ClipboardList, ShieldCheck, UserPlus, ArrowUpRight, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, ApiError } from '../../lib/api';
import { formatNaira } from '../../lib/money';
import { CreateStaffForm } from '../../components/CreateStaffForm';
import { Greeting } from '../../components/Greeting';
import { ClaimsPanel } from '../../components/ClaimsPanel';
import { Skeleton } from '../../components/Skeleton';
import { OrangeHospitalLogo, PoweredByOrangeHospital } from '../../components/OrangeHospitalLogo';

interface Summary {
  totalMembers: number;
  healthFundTotal: number;
  generalFundTotal: number;
}

interface DrawRequest {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
  member: { id: string; fullName: string; phone: string };
}

type AdminTab = 'requests' | 'claims' | 'staff';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pending, setPending] = useState<DrawRequest[] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('requests');

  function loadAll() {
    api<Summary>('/funds/summary').then(setSummary);
    api<DrawRequest[]>('/draw-requests/pending').then(setPending);
  }

  useEffect(loadAll, []);

  async function review(id: string, decision: 'APPROVED' | 'DECLINED') {
    setActionError(null);
    setBusyId(id);
    try {
      await api(`/draw-requests/${id}/review`, {
        method: 'PATCH',
        body: { decision },
      });
      loadAll();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Could not process this request.',
      );
    } finally {
      setBusyId(null);
    }
  }

  const grandTotal = summary ? summary.healthFundTotal + summary.generalFundTotal : 0;
  const healthPercent = grandTotal > 0 ? Math.round((summary!.healthFundTotal / grandTotal) * 100) : 50;

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
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-rust/10 text-rust border border-rust/15">
              Admin Portal
            </span>
            <span className="hidden md:inline-block">
              <PoweredByOrangeHospital theme="light" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-ink-soft bg-ink/5 px-3 py-1.5 rounded-full border border-ink/5">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
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
        {/* Greeting Banner */}
        {user && <Greeting fullName={user.fullName} role="ADMIN" />}

        {/* Executive Stats & Pool Breakdown */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest" />
              <span>Financial Overview & Reserve Pools</span>
            </h2>
            {summary && (
              <span className="text-xs font-semibold text-forest bg-forest/10 px-3 py-1 rounded-full border border-forest/15">
                Grand Pool: {formatNaira(grandTotal)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {!summary ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  icon={Users}
                  label="Total Active Members"
                  value={String(summary.totalMembers)}
                  subtitle="Verified contributors"
                  accentColor="border-l-indigo-500"
                  iconBg="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                  icon={Heart}
                  label="Health Fund Reserve"
                  value={formatNaira(summary.healthFundTotal)}
                  subtitle={`${healthPercent}% of grand reserve`}
                  accentColor="border-l-forest"
                  iconBg="bg-forest/10 text-forest"
                />
                <StatCard
                  icon={Wallet}
                  label="General Ajo Pool"
                  value={formatNaira(summary.generalFundTotal)}
                  subtitle={`${100 - healthPercent}% of grand reserve`}
                  accentColor="border-l-rust"
                  iconBg="bg-rust/10 text-rust"
                />
              </>
            )}
          </div>

          {/* Visual Pool Allocation Progress Bar */}
          {summary && grandTotal > 0 && (
            <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-forest">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest" />
                  <span>Health Ajo Pool ({healthPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-rust">
                  <span className="w-2.5 h-2.5 rounded-full bg-rust" />
                  <span>General Ajo Pool ({100 - healthPercent}%)</span>
                </div>
              </div>
              <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden flex p-0.5 border border-ink/10">
                <div
                  className="h-full bg-forest rounded-l-full transition-all duration-500"
                  style={{ width: `${healthPercent}%` }}
                />
                <div
                  className="h-full bg-rust rounded-r-full transition-all duration-500"
                  style={{ width: `${100 - healthPercent}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Tabbed Navigation Bar */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 p-1.5 bg-white border border-ink/10 rounded-2xl shadow-xs">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-ink-soft hover:text-ink hover:bg-ink/5'
              }`}
            >
              <ClipboardList size={15} />
              <span>Draw Requests</span>
              {pending && pending.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-rust text-white font-bold animate-pulse">
                  {pending.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'claims'
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-ink-soft hover:text-ink hover:bg-ink/5'
              }`}
            >
              <Heart size={15} />
              <span>Beneficiary Claims</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'staff'
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-ink-soft hover:text-ink hover:bg-ink/5'
              }`}
            >
              <UserPlus size={15} />
              <span>Staff Accounts</span>
            </button>
          </div>

          {/* TAB 1: Draw Requests */}
          {activeTab === 'requests' && (
            <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm transition-all">
              <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between bg-paper/30">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-forest" />
                  <h3 className="font-semibold text-sm text-ink">Health Fund Draw Requests</h3>
                </div>
                <span className="text-xs text-ink-soft">
                  {pending ? `${pending.length} pending` : 'Loading...'}
                </span>
              </div>

              {actionError && (
                <div className="px-6 py-3 text-xs text-rust bg-rust/5 border-b border-rust/15 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{actionError}</span>
                </div>
              )}

              {pending && pending.length === 0 && (
                <div className="px-6 py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                    <Check size={20} />
                  </div>
                  <div className="text-sm font-semibold text-ink">All caught up!</div>
                  <div className="text-xs text-ink-soft max-w-sm mx-auto">
                    There are no pending member draw requests right now.
                  </div>
                </div>
              )}

              <div className="divide-y divide-ink/10">
                {pending?.map((req) => (
                  <div
                    key={req.id}
                    className="px-6 py-4 hover:bg-paper/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink">{req.member.fullName}</span>
                        <span className="text-[11px] font-mono text-ink-soft/80 bg-ink/5 px-2 py-0.5 rounded border border-ink/10">
                          📞 {req.member.phone}
                        </span>
                      </div>
                      <div className="text-xs text-ink-soft leading-relaxed flex items-center gap-2">
                        <span className="font-bold text-forest text-sm">{formatNaira(req.amount)}</span>
                        <span>&middot;</span>
                        <span className="italic">"{req.reason}"</span>
                      </div>
                      <div className="text-[11px] text-ink-soft/60">
                        Requested on {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => review(req.id, 'DECLINED')}
                        disabled={busyId === req.id}
                        className="flex items-center gap-1 text-xs font-semibold border border-rust/30 text-rust hover:bg-rust/5 rounded-xl px-3.5 py-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => review(req.id, 'APPROVED')}
                        disabled={busyId === req.id}
                        className="flex items-center gap-1 text-xs font-semibold bg-forest hover:bg-forest-light text-white rounded-xl px-4 py-2 shadow-sm shadow-forest/20 disabled:opacity-50 transition-all active:scale-[0.98]"
                      >
                        <Check size={14} />
                        <span>Approve Draw</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Claims Panel */}
          {activeTab === 'claims' && <ClaimsPanel />}

          {/* TAB 3: Staff Management */}
          {activeTab === 'staff' && <CreateStaffForm />}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accentColor,
  iconBg,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
  iconBg: string;
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
      <Skeleton className="h-7 w-28 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}


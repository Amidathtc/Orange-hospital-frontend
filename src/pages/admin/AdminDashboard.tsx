import { useEffect, useState } from 'react';
import { Users, Wallet, Heart, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, ApiError } from '../../lib/api';
import { formatNaira } from '../../lib/money';
import { CreateStaffForm } from '../../components/CreateStaffForm';
import { Greeting } from '../../components/Greeting';
import { ClaimsPanel } from '../../components/ClaimsPanel';
import { Skeleton } from '../../components/Skeleton';

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

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pending, setPending] = useState<DrawRequest[] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <span className="font-display font-semibold">
          Orange Health <span className="text-rust">Ajo</span> &middot;{' '}
          <span className="text-ink-soft font-normal text-sm">Admin</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-soft hidden sm:inline">{user?.fullName}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {user && <Greeting fullName={user.fullName} role="ADMIN" />}
        <h2 className="font-display text-lg font-semibold mb-4">Fund overview</h2>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {!summary ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <Stat icon={Users} label="Total members" value={String(summary.totalMembers)} />
              <Stat icon={Heart} label="Health fund pool" value={formatNaira(summary.healthFundTotal)} />
              <Stat icon={Wallet} label="General ajo pool" value={formatNaira(summary.generalFundTotal)} />
            </>
          )}
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-ink/10 flex items-center gap-2">
            <ClipboardList size={16} className="text-ink-soft" />
            <h2 className="font-semibold text-sm">Health fund draw requests</h2>
          </div>

          {actionError && (
            <div className="px-6 py-3 text-sm text-rust border-b border-ink/10">{actionError}</div>
          )}

          {pending && pending.length === 0 && (
            <div className="px-6 py-8 text-sm text-ink-soft text-center">
              No pending requests right now.
            </div>
          )}

          {pending?.map((req) => (
            <div
              key={req.id}
              className="px-6 py-4 border-b border-ink/10 last:border-b-0 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-semibold text-sm">{req.member.fullName}</div>
                <div className="text-xs text-ink-soft">
                  {formatNaira(req.amount)} &middot; {req.reason}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => review(req.id, 'DECLINED')}
                  disabled={busyId === req.id}
                  className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-2 text-ink-soft disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Decline
                </button>
                <button
                  onClick={() => review(req.id, 'APPROVED')}
                  disabled={busyId === req.id}
                  className="text-xs font-semibold bg-forest hover:bg-forest-light text-white rounded-lg px-3 py-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>

        <ClaimsPanel />
        <CreateStaffForm />
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-1.5 text-ink-soft mb-1.5">
        <Icon size={13} />
        <div className="text-xs">{label}</div>
      </div>
      <div className="font-display text-lg font-medium">{value}</div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-4">
      <Skeleton className="h-3.5 w-20 mb-2.5" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

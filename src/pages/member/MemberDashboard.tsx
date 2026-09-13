import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { formatNaira } from '../../lib/money';
import { ContributeModal } from '../../components/ContributeModal';
import { NextOfKinCard } from '../../components/NextOfKinCard';
import { Greeting } from '../../components/Greeting';
import { DrawRequestModal } from '../../components/DrawRequestModal';
import { OrangeHospitalLogo, PoweredByOrangeHospital } from '../../components/OrangeHospitalLogo';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
type FundType = 'HEALTH' | 'GENERAL';
type DrawStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

interface Fund {
  id: string;
  type: FundType;
  balance: number;
  amount: number;
  frequency: Frequency;
}

interface DrawRequest {
  id: string;
  amount: number;
  reason: string;
  status: DrawStatus;
  createdAt: string;
}

const freqLabel: Record<Frequency, string> = {
  DAILY: '/ day',
  WEEKLY: '/ week',
  MONTHLY: '/ month',
};

const statusStyle: Record<DrawStatus, string> = {
  PENDING: 'text-brass bg-brass/10',
  APPROVED: 'text-forest bg-forest/10',
  DECLINED: 'text-rust bg-rust/10',
};

export function MemberDashboard() {
  const { user, logout } = useAuth();
  const [funds, setFunds] = useState<Fund[] | null>(null);
  const [drawRequests, setDrawRequests] = useState<DrawRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalFund, setModalFund] = useState<Fund | null>(null);
  const [drawFund, setDrawFund] = useState<Fund | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  function loadFunds() {
    return api<Fund[]>('/funds/me')
      .then(setFunds)
      .catch(() => setError('Could not load your funds. Try refreshing.'));
  }

  function loadDrawRequests() {
    api<DrawRequest[]>('/draw-requests/me').then(setDrawRequests);
  }

  useEffect(() => {
    loadFunds();
    loadDrawRequests();

    // Returning from Paystack — the webhook may take a few seconds to land,
    // so poll briefly rather than assume the balance is already updated.
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'complete') {
      setConfirmingPayment(true);
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts += 1;
        await loadFunds();
        if (attempts >= 5) {
          clearInterval(interval);
          setConfirmingPayment(false);
        }
      }, 2000);
      window.history.replaceState({}, '', '/member');
      return () => clearInterval(interval);
    }
  }, []);

  const health = funds?.find((f) => f.type === 'HEALTH');
  const general = funds?.find((f) => f.type === 'GENERAL');

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between bg-white/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-ink/10 flex items-center justify-center shadow-xs">
            <OrangeHospitalLogo className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-semibold text-base">
              Orange Health <span className="text-rust">Ajo</span>
            </span>
            <span className="hidden sm:inline-block">
              <PoweredByOrangeHospital theme="light" />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-soft hidden sm:inline">{user?.fullName}</span>
          <button onClick={logout} className="text-sm font-semibold text-ink-soft">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {user && <Greeting fullName={user.fullName} role="MEMBER" />}

        {confirmingPayment && (
          <div className="text-sm text-forest bg-forest/5 border border-forest/20 rounded-lg px-3 py-2 mb-5">
            Confirming your payment — this can take a few seconds…
          </div>
        )}

        {error && <div className="text-rust text-sm mb-4">{error}</div>}
        {!funds && !error && <div className="text-ink-soft text-sm">Loading your funds…</div>}

        {funds && (
          <div className="grid sm:grid-cols-2 gap-5">
            {health && (
              <FundCard
                fund={health}
                label="Health ajo"
                accent="forest"
                onFund={() => setModalFund(health)}
                onWithdraw={() => setDrawFund(health)}
              />
            )}
            {general && (
              <FundCard
                fund={general}
                label="General ajo"
                accent="rust"
                onFund={() => setModalFund(general)}
                onWithdraw={() => setDrawFund(general)}
              />
            )}
          </div>
        )}

        {drawRequests && drawRequests.length > 0 && (
          <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden mt-5">
            <div className="px-6 py-4 border-b border-ink/10">
              <h3 className="font-semibold text-sm">Your withdrawal requests</h3>
            </div>
            {drawRequests.map((r) => (
              <div
                key={r.id}
                className="px-6 py-3.5 border-b border-ink/10 last:border-b-0 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">{formatNaira(r.amount)}</div>
                  <div className="text-xs text-ink-soft">{r.reason}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle[r.status]}`}>
                  {r.status === 'PENDING' ? 'Pending' : r.status === 'APPROVED' ? 'Approved' : 'Declined'}
                </span>
              </div>
            ))}
          </div>
        )}

        <NextOfKinCard />
      </main>

      {modalFund && (
        <ContributeModal
          fundType={modalFund.type}
          fundLabel={modalFund.type === 'HEALTH' ? 'Health ajo' : 'General ajo'}
          defaultAmount={modalFund.amount}
          onClose={() => setModalFund(null)}
        />
      )}

      {drawFund && (
        <DrawRequestModal
          fundType={drawFund.type}
          fundLabel={drawFund.type === 'HEALTH' ? 'Health ajo' : 'General ajo'}
          currentBalance={drawFund.balance}
          onClose={() => {
            setDrawFund(null);
            loadDrawRequests();
          }}
        />
      )}
    </div>
  );
}

function FundCard({
  fund,
  label,
  accent,
  onFund,
  onWithdraw,
}: {
  fund: Fund;
  label: string;
  accent: 'forest' | 'rust';
  onFund: () => void;
  onWithdraw?: () => void;
}) {
  const borderColor = accent === 'forest' ? 'border-t-forest' : 'border-t-rust';
  const btnColor = accent === 'forest' ? 'bg-forest' : 'bg-rust';

  return (
    <div className={`bg-white border border-ink/10 border-t-4 ${borderColor} rounded-2xl p-6`}>
      <div className="text-lg font-semibold mb-4">{label}</div>
      <div className="font-mono text-3xl font-medium mb-1">{formatNaira(fund.balance)}</div>
      <div className="text-sm text-ink-soft mb-5">
        {formatNaira(fund.amount)} {freqLabel[fund.frequency]}
      </div>
      <button onClick={onFund} className={`w-full ${btnColor} text-white font-semibold text-sm rounded-lg py-3`}>
        Fund next contribution
      </button>
      {onWithdraw && (
        <button
          onClick={onWithdraw}
          className="w-full mt-2 border border-ink/15 text-ink-soft font-semibold text-sm rounded-lg py-3"
        >
          Request withdrawal for treatment
        </button>
      )}
    </div>
  );
}

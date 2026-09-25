import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { formatNaira } from '../lib/money';

type FundType = 'HEALTH' | 'GENERAL';

interface Props {
  fundType: FundType;
  fundLabel: string;
  defaultAmount: number; // in kobo, the fund's per-cycle contribution amount
  onClose: () => void;
}

interface InitiateResponse {
  transactionId: string;
  authorizationUrl: string;
  reference: string;
}

export function ContributeModal({ fundType, fundLabel, defaultAmount, onClose }: Props) {
  const [amount, setAmount] = useState(defaultAmount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await api<InitiateResponse>('/transactions/contribute', {
        method: 'POST',
        body: { fundType, amount },
      });
      // Paystack's hosted checkout — leaving the app here is expected and correct.
      // The member lands back on /member?payment=complete once they're done.
      window.location.href = result.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start payment. Check your connection and try again.',
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/45 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-ink-soft text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-1">
          {fundLabel}
        </div>
        <h2 className="font-display text-xl font-semibold mb-5">Fund your ajo</h2>

        <div className="bg-paper rounded-xl px-4 py-3.5 mb-3 flex items-center gap-2">
          <span className="text-xl font-medium text-ink-soft">₦</span>
          <input
            type="number"
            min={10}
            value={amount / 100}
            onChange={(e) => setAmount(Math.round(Number(e.target.value) * 100))}
            className="bg-transparent font-mono text-xl font-medium w-full outline-none"
          />
        </div>

        <div className="flex gap-2 mb-6">
          {[1, 5, 10].map((mult) => (
            <button
              key={mult}
              onClick={() => setAmount(defaultAmount * mult)}
              className="flex-1 border border-ink/15 rounded-lg py-2 text-xs font-semibold text-ink-soft"
            >
              {mult}&times;
            </button>
          ))}
        </div>

        {error && (
          <div className="text-sm text-rust bg-rust/5 border border-rust/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={submitting || amount < 1000}
          className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3.5 disabled:opacity-60 hover:bg-forest-light transition-all shadow-md"
        >
          {submitting ? 'Redirecting to Monnify Payment…' : `Pay ${formatNaira(amount)} via Monnify`}
        </button>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-ink-soft flex items-center justify-center gap-1.5 font-medium">
            <span>🔒 Bank Transfer, Card & USSD</span>
            <span className="text-ink/30">•</span>
            <span className="text-forest font-semibold">Monnify Secure</span>
          </p>
        </div>
      </div>
    </div>
  );
}

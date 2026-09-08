import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { formatNaira, nairaToKobo } from '../lib/money';

export function DrawRequestModal({
  fundType,
  fundLabel,
  currentBalance,
  onClose,
}: {
  fundType: 'HEALTH' | 'GENERAL';
  fundLabel: string;
  currentBalance: number;
  onClose: () => void;
}) {
  const [amountNaira, setAmountNaira] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api('/draw-requests', {
        method: 'POST',
        body: { fundType, amount: nairaToKobo(Number(amountNaira)), reason },
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit this request.');
    } finally {
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

        {success ? (
          <div className="py-4">
            <div className="text-forest font-semibold mb-1">Request submitted</div>
            <div className="text-sm text-ink-soft mb-5">
              Orange Health will review this and get back to you.
            </div>
            <button
              onClick={onClose}
              className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="font-display text-xl font-semibold mb-1">Request withdrawal</h2>
            <p className="text-sm text-ink-soft mb-5">
              From your {fundLabel} — reviewed by Orange Health, not automatic.
              Available balance: {formatNaira(currentBalance)}
            </p>

            <input
              type="number"
              required
              min={10}
              value={amountNaira}
              onChange={(e) => setAmountNaira(e.target.value)}
              placeholder="Amount needed (₦)"
              className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm mb-3 focus:outline-none focus:border-forest"
            />
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What is this for?"
              rows={3}
              className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm mb-4 focus:outline-none focus:border-forest"
            />

            {error && (
              <div className="text-sm text-rust bg-rust/5 border border-rust/20 rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

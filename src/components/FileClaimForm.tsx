import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import { nairaToKobo } from '../lib/money';

export function FileClaimForm({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [open, setOpen] = useState(false);
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [claimantRelationship, setClaimantRelationship] = useState('');
  const [amountNaira, setAmountNaira] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api('/beneficiary-claims', {
        method: 'POST',
        body: {
          deceasedMemberId: memberId,
          claimantName,
          claimantPhone,
          claimantRelationship,
          amount: nairaToKobo(Number(amountNaira)),
        },
      });
      setSuccess(true);
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not file this claim.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <div className="border-t border-ink/10 pt-4 mt-4">
        {success && (
          <div className="text-forest text-sm mb-3">
            Claim filed — an admin will review it before anything is paid out.
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-2 text-ink-soft"
        >
          File a beneficiary claim for {memberName}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-ink/10 pt-4 mt-4 space-y-3">
      <div className="text-xs font-semibold text-ink-soft">
        Beneficiary claim — this does not release any money. An admin reviews it first.
      </div>
      <input
        type="text"
        required
        placeholder="Claimant's full name"
        value={claimantName}
        onChange={(e) => setClaimantName(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      <input
        type="text"
        required
        placeholder="Relationship to member"
        value={claimantRelationship}
        onChange={(e) => setClaimantRelationship(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      <input
        type="tel"
        required
        placeholder="Claimant's phone number"
        value={claimantPhone}
        onChange={(e) => setClaimantPhone(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      <input
        type="number"
        required
        min={10}
        placeholder="Amount requested (₦)"
        value={amountNaira}
        onChange={(e) => setAmountNaira(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />

      {error && <div className="text-sm text-rust">{error}</div>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 border border-ink/15 rounded-lg py-2.5 text-sm font-semibold text-ink-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-rust text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? 'Filing…' : 'File claim'}
        </button>
      </div>
    </form>
  );
}

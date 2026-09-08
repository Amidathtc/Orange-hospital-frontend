import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { formatNaira } from '../lib/money';

interface Claim {
  id: string;
  amount: number;
  claimantName: string;
  claimantPhone: string;
  claimantRelationship: string;
  deceasedMember: { fullName: string; phone: string };
}

interface HistoryEntry {
  changedAt: string;
  changedByRole: 'SELF' | 'RECEPTIONIST';
  previousName: string | null;
  previousPhone: string | null;
  previousRel: string | null;
}

interface ReviewContext {
  claim: Claim;
  nextOfKinOnFile: { fullName: string; relationship: string; phone: string } | null;
  history: HistoryEntry[];
  daysSinceLastChange: number | null;
}

export function ClaimsPanel() {
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [context, setContext] = useState<ReviewContext | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadClaims() {
    api<Claim[]>('/beneficiary-claims/pending').then(setClaims);
  }

  useEffect(loadClaims, []);

  async function openClaim(id: string) {
    setOpenId(id);
    setContext(null);
    setNotes('');
    const result = await api<ReviewContext>(`/beneficiary-claims/${id}/review-context`);
    setContext(result);
  }

  async function decide(decision: 'APPROVED' | 'DECLINED') {
    if (!openId) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/beneficiary-claims/${openId}/review`, {
        method: 'PATCH',
        body: { decision, notes },
      });
      setOpenId(null);
      setContext(null);
      loadClaims();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not process this claim.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-ink/10">
        <h3 className="font-semibold text-sm">Beneficiary claims</h3>
      </div>

      {claims && claims.length === 0 && (
        <div className="px-6 py-8 text-sm text-ink-soft text-center">No pending claims.</div>
      )}

      {claims?.map((claim) => (
        <div key={claim.id} className="border-b border-ink/10 last:border-b-0">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm">{claim.deceasedMember.fullName}</div>
              <div className="text-xs text-ink-soft">
                Claim by {claim.claimantName} ({claim.claimantRelationship}) &middot;{' '}
                {formatNaira(claim.amount)}
              </div>
            </div>
            <button
              onClick={() => openClaim(claim.id)}
              className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-2 shrink-0"
            >
              Review
            </button>
          </div>

          {openId === claim.id && context && (
            <div className="px-6 pb-5 bg-paper/50">
              <div className="border border-ink/10 rounded-xl bg-white p-4 mb-3">
                <div className="text-xs font-semibold text-ink-soft mb-2">
                  Next of kin on file
                </div>
                {context.nextOfKinOnFile ? (
                  <div className="text-sm">
                    {context.nextOfKinOnFile.fullName} &middot;{' '}
                    {context.nextOfKinOnFile.relationship} &middot;{' '}
                    {context.nextOfKinOnFile.phone}
                  </div>
                ) : (
                  <div className="text-sm text-ink-soft">No next of kin on file.</div>
                )}

                {context.daysSinceLastChange !== null && context.daysSinceLastChange < 30 && (
                  <div className="text-xs text-rust bg-rust/5 border border-rust/20 rounded-lg px-3 py-2 mt-3">
                    ⚠ This was changed {context.daysSinceLastChange} day
                    {context.daysSinceLastChange === 1 ? '' : 's'} ago — worth extra scrutiny
                    before approving.
                  </div>
                )}

                {context.history.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-ink/10">
                    <div className="text-xs font-semibold text-ink-soft mb-1.5">
                      Change history
                    </div>
                    {context.history.map((h, i) => (
                      <div key={i} className="text-xs text-ink-soft mb-1">
                        {new Date(h.changedAt).toLocaleDateString()} — changed by{' '}
                        {h.changedByRole === 'SELF' ? 'the member' : 'reception'}
                        {h.previousName && <> (was: {h.previousName})</>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                placeholder="Notes — what proof was shown (e.g. death certificate)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest mb-3"
                rows={2}
              />

              {error && <div className="text-sm text-rust mb-3">{error}</div>}

              <div className="flex gap-2">
                <button
                  onClick={() => decide('DECLINED')}
                  disabled={busy}
                  className="flex-1 border border-ink/15 rounded-lg py-2.5 text-sm font-semibold text-ink-soft disabled:opacity-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => decide('APPROVED')}
                  disabled={busy}
                  className="flex-1 bg-forest text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  Approve payout
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

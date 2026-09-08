import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, ApiError } from '../../lib/api';
import { formatNaira, nairaToKobo } from '../../lib/money';
import { Greeting } from '../../components/Greeting';
import { FileClaimForm } from '../../components/FileClaimForm';
import { AssistedResetForm } from '../../components/AssistedResetForm';

type FundType = 'HEALTH' | 'GENERAL';

interface Fund {
  id: string;
  type: FundType;
  balance: number;
}

interface Member {
  id: string;
  fullName: string;
  phone: string;
  funds: Fund[];
}

export function ReceptionDashboard() {
  const { user, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const [fundType, setFundType] = useState<FundType>('HEALTH');
  const [amountNaira, setAmountNaira] = useState('');
  const [logging, setLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);
  const [logError, setLogError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError(null);
    setLogSuccess(null);
    setMember(null);
    setSearching(true);
    try {
      const result = await api<Member>(`/funds/lookup?phone=${encodeURIComponent(phone)}`);
      setMember(result);
    } catch (err) {
      setSearchError(
        err instanceof ApiError ? err.message : 'Could not search right now.',
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setLogError(null);
    setLogSuccess(null);
    setLogging(true);
    try {
      await api('/transactions/walk-in', {
        method: 'POST',
        body: {
          memberId: member.id,
          fundType,
          amount: nairaToKobo(Number(amountNaira)),
        },
      });
      setLogSuccess(`Recorded ${formatNaira(nairaToKobo(Number(amountNaira)))} for ${member.fullName}.`);
      setAmountNaira('');
      const refreshed = await api<Member>(`/funds/lookup?phone=${encodeURIComponent(member.phone)}`);
      setMember(refreshed);
    } catch (err) {
      setLogError(err instanceof ApiError ? err.message : 'Could not record this payment.');
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <span className="font-display font-semibold">
          Orange Health <span className="text-rust">Ajo</span> &middot;{' '}
          <span className="text-ink-soft font-normal text-sm">Front desk</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-soft hidden sm:inline">{user?.fullName}</span>
          <button onClick={logout} className="text-sm font-semibold text-ink-soft">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        {user && <Greeting fullName={user.fullName} role="RECEPTIONIST" />}
        <h2 className="font-display text-lg font-semibold mb-4">Walk-in contribution</h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Member's phone number"
            className="flex-1 px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-ink text-white text-sm font-semibold px-5 rounded-lg disabled:opacity-60"
          >
            {searching ? 'Searching…' : 'Find'}
          </button>
        </form>

        {searchError && <div className="text-rust text-sm mb-6">{searchError}</div>}

        {member && (
          <div className="bg-white border border-ink/10 rounded-2xl p-6">
            <div className="font-semibold mb-1">{member.fullName}</div>
            <div className="text-sm text-ink-soft mb-5">{member.phone}</div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {member.funds.map((f) => (
                <div key={f.id} className="bg-paper rounded-lg px-3 py-2.5">
                  <div className="text-xs text-ink-soft mb-0.5">
                    {f.type === 'HEALTH' ? 'Health ajo' : 'General ajo'}
                  </div>
                  <div className="font-mono font-medium">{formatNaira(f.balance)}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleLog} className="space-y-3 border-t border-ink/10 pt-5">
              <div className="flex gap-2">
                <select
                  value={fundType}
                  onChange={(e) => setFundType(e.target.value as FundType)}
                  className="px-3 py-2.5 border border-ink/15 rounded-lg text-sm bg-white"
                >
                  <option value="HEALTH">Health ajo</option>
                  <option value="GENERAL">General ajo</option>
                </select>
                <input
                  type="number"
                  required
                  min={10}
                  value={amountNaira}
                  onChange={(e) => setAmountNaira(e.target.value)}
                  placeholder="Amount (₦)"
                  className="flex-1 px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
                />
              </div>

              {logError && <div className="text-rust text-sm">{logError}</div>}
              {logSuccess && <div className="text-forest text-sm">{logSuccess}</div>}

              <button
                type="submit"
                disabled={logging}
                className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 disabled:opacity-60"
              >
                {logging ? 'Recording…' : 'Record & receipt'}
              </button>
            </form>

            <WitnessKinForm memberId={member.id} />
            <FileClaimForm memberId={member.id} memberName={member.fullName} />
            <AssistedResetForm memberId={member.id} memberName={member.fullName} />
          </div>
        )}
      </main>
    </div>
  );
}

function WitnessKinForm({ memberId }: { memberId: string }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // staff.fullName is attached server-side from the receptionist's own
      // verified token — never sent from this form — so the witness record
      // can't be spoofed with a different name.
      await api(`/next-of-kin/witness/${memberId}`, {
        method: 'PUT',
        body: { fullName, relationship, phone },
      });
      setSuccess(true);
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save next of kin.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <div className="border-t border-ink/10 pt-4 mt-4">
        {success && (
          <div className="text-forest text-sm mb-3">Next of kin recorded and witnessed.</div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-2 text-ink-soft"
        >
          Record next of kin for this member
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="border-t border-ink/10 pt-4 mt-4 space-y-3">
      <div className="text-xs font-semibold text-ink-soft">Next of kin (witnessed by you)</div>
      <input
        type="text"
        required
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      <input
        type="text"
        required
        placeholder="Relationship"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      <input
        type="tel"
        required
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
      />
      {error && <div className="text-rust text-sm">{error}</div>}
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
          className="flex-1 bg-forest text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';

interface NextOfKin {
  fullName: string;
  relationship: string;
  phone: string;
  witnessedBy: string | null;
}

export function NextOfKinCard() {
  const [kin, setKin] = useState<NextOfKin | null | undefined>(undefined); // undefined = still loading
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<NextOfKin | null>('/next-of-kin/me')
      .then((result) => {
        setKin(result);
        if (result) {
          setFullName(result.fullName);
          setRelationship(result.relationship);
          setPhone(result.phone);
        }
      })
      .catch(() => setKin(null));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await api<NextOfKin>('/next-of-kin/me', {
        method: 'PUT',
        body: { fullName, relationship, phone },
      });
      setKin(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  if (kin === undefined) {
    return null; // still loading, avoid a flash of "no next of kin" before we know
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden mt-5 shadow-sm">
      <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Next of kin</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-1.5"
          >
            {kin ? 'Edit' : 'Add'}
          </button>
        )}
      </div>

      {!editing && kin && (
        <div className="px-6 py-4">
          <div className="font-semibold text-sm mb-0.5">{kin.fullName}</div>
          <div className="text-xs text-ink-soft">
            {kin.relationship} &middot; {kin.phone}
            {kin.witnessedBy && <> &middot; witnessed by {kin.witnessedBy}</>}
          </div>
        </div>
      )}

      {!editing && !kin && (
        <div className="px-6 py-6 text-sm text-ink-soft text-center">
          No next of kin on file yet — add one so your family can be reached if needed.
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="px-6 py-5 space-y-3">
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
            placeholder="Relationship (e.g. Daughter)"
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

          {error && <div className="text-sm text-rust">{error}</div>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
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
      )}
    </div>
  );
}

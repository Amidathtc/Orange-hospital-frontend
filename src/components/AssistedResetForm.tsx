import { useState } from 'react';
import { api, ApiError } from '../lib/api';

export function AssistedResetForm({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api('/auth/assisted-reset', {
        method: 'POST',
        body: { memberId, newPassword },
      });
      setSuccess(true);
      setOpen(false);
      setNewPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reset this password.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <div className="border-t border-ink/10 pt-4 mt-4">
        {success && (
          <div className="text-forest text-sm mb-3">
            Password reset. Let {memberName} know their new password directly.
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-2 text-ink-soft"
        >
          Reset {memberName}'s password
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-ink/10 pt-4 mt-4 space-y-3">
      <div className="text-xs font-semibold text-ink-soft">
        Only use this after confirming who they are in person.
      </div>
      <input
        type="text"
        required
        minLength={6}
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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
          className="flex-1 bg-forest text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Set new password'}
        </button>
      </div>
    </form>
  );
}

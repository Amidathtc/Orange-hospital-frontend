import { useState } from 'react';
import { api, ApiError } from '../lib/api';

type StaffRole = 'RECEPTIONIST' | 'MARKETER' | 'ADMIN';

export function CreateStaffForm() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('RECEPTIONIST');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await api('/auth/create-staff', {
        method: 'POST',
        body: { fullName, phone, password, role },
      });
      setSuccess(`${role === 'ADMIN' ? 'Admin' : role === 'MARKETER' ? 'Marketer' : 'Receptionist'} account created for ${fullName}.`);
      setFullName('');
      setPhone('');
      setPassword('');
      setRole('RECEPTIONIST');
      setOpen(false);
    } catch (err) {
      // A receptionist account can never reach this screen in the first place —
      // this route is only rendered inside the admin dashboard — but the backend
      // enforces it too, so this error path only ever fires for things like a
      // duplicate phone number, not a permissions problem.
      setError(err instanceof ApiError ? err.message : 'Could not create this account.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden mt-6 shadow-sm">
      <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Staff accounts</h3>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="text-xs font-semibold border border-ink/15 rounded-lg px-3 py-1.5"
          >
            Add staff
          </button>
        )}
      </div>

      {success && (
        <div className="px-6 py-3 text-sm text-forest border-b border-ink/10">{success}</div>
      )}

      {!open && !success && (
        <div className="px-6 py-6 text-sm text-ink-soft text-center">
          Create a login for a receptionist, marketer, or another admin.
        </div>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          <input
            type="password"
            required
            minLength={6}
            placeholder="Temporary password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
          />

          <div>
            <div className="text-xs font-semibold text-ink-soft mb-1.5">Role</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('RECEPTIONIST')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold border ${
                  role === 'RECEPTIONIST'
                    ? 'border-forest text-forest bg-forest/5'
                    : 'border-ink/15 text-ink-soft'
                }`}
              >
                Receptionist
              </button>
              <button
                type="button"
                onClick={() => setRole('MARKETER')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold border ${
                  role === 'MARKETER'
                    ? 'border-amber-600 text-amber-600 bg-amber-600/5'
                    : 'border-ink/15 text-ink-soft'
                }`}
              >
                Marketer
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold border ${
                  role === 'ADMIN' ? 'border-rust text-rust bg-rust/5' : 'border-ink/15 text-ink-soft'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && <div className="text-sm text-rust">{error}</div>}

          <div className="flex gap-2 pt-1">
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
              {saving ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

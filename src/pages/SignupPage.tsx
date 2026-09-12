import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(fullName, phone, email, password);
      navigate('/member');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold mb-1">Join the ajo</h1>
      <p className="text-sm text-ink-soft mb-7">
        Two funds set up automatically — Health Ajo and General Ajo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
            placeholder="e.g. Mrs. Adeyemi"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">
            Phone number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
            placeholder="0803 xxx xxxx"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">
            Email <span className="font-normal text-ink-soft/70">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
            placeholder="you@example.com"
          />
          <p className="text-xs text-ink-soft/70 mt-1.5">
            Lets you reset your own password and pay online. Without one, Orange Health
            reception can help you in person.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <div className="text-sm text-rust bg-rust/5 border border-rust/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-forest text-white font-semibold text-sm rounded-lg py-3 mt-2 disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-xs text-ink-soft mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-forest font-semibold">
          Sign in
        </a>
      </p>
    </AuthLayout>
  );
}

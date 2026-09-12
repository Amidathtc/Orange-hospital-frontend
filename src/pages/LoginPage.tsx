import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { AuthLayout } from '../components/AuthLayout';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(phone, password);
      redirectByRole();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function redirectByRole() {
    const stored = localStorage.getItem('oha_user');
    const role = stored ? JSON.parse(stored).role : null;
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'RECEPTIONIST') navigate('/reception');
    else navigate('/member');
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-ink-soft mb-7">Sign in to your ajo.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          <label className="block text-xs font-semibold text-ink-soft mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink/15 rounded-lg text-sm focus:outline-none focus:border-forest"
            placeholder="••••••••"
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
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="text-center mt-4">
        <a href="/forgot-password" className="text-xs text-ink-soft font-semibold">
          Forgot password?
        </a>
      </div>

      <p className="text-center text-xs text-ink-soft mt-6">
        New member?{' '}
        <a href="/signup" className="text-forest font-semibold">
          Create an account
        </a>
      </p>
    </AuthLayout>
  );
}

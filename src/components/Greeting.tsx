import { getGreeting } from '../lib/greeting';

type Role = 'MEMBER' | 'RECEPTIONIST' | 'MARKETER' | 'ADMIN';

export function Greeting({ fullName, role }: { fullName: string; role: Role }) {
  const { hello, line } = getGreeting(fullName, role);
  return (
    <div className="mb-6">
      <div className="font-display text-2xl font-semibold">{hello}</div>
      <div className="text-sm text-ink-soft mt-0.5">{line}</div>
    </div>
  );
}

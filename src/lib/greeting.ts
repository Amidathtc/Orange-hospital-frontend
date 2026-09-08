type Role = 'MEMBER' | 'RECEPTIONIST' | 'ADMIN';

function timeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// One line, tailored per role — not generic. A member sees something about
// their own fund; reception and admin see something about the work ahead.
const ROLE_LINES: Record<Role, string[]> = {
  MEMBER: [
    'Every contribution today is care you won\'t have to wait for tomorrow.',
    'Your ajo is growing — take a look.',
    'Small and steady wins here.',
  ],
  RECEPTIONIST: [
    'Ready to help someone today?',
    'Someone\'s ajo might need you today.',
    'Front desk is open — let\'s go.',
  ],
  ADMIN: [
    'Here\'s how the community fund is doing.',
    'A quick look at the numbers before the day starts.',
    'The fund, at a glance.',
  ],
};

export function getGreeting(fullName: string, role: Role): { hello: string; line: string } {
  const period = timeOfDay();
  const firstName = fullName.trim().split(' ')[0];
  const lines = ROLE_LINES[role];
  // Rotate by day-of-year so it's not the exact same line every single login,
  // without needing any state or storage.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const line = lines[dayOfYear % lines.length];

  return {
    hello: `Good ${period}, ${firstName}`,
    line,
  };
}

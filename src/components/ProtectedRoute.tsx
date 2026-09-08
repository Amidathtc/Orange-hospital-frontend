import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'MEMBER' | 'RECEPTIONIST' | 'ADMIN';

// Note: this is a UX convenience, not the real security boundary — a member
// typing /admin in the address bar gets bounced here, but the actual protection
// is the backend's RolesGuard rejecting their API calls regardless of what
// the frontend shows. Never rely on this component alone.
export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

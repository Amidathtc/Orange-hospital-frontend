import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { MemberDashboard } from './pages/member/MemberDashboard';
import { ReceptionDashboard } from './pages/reception/ReceptionDashboard';
import { MarketerDashboard } from './pages/marketer/MarketerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function RouteMetaHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const titleMap: Record<string, string> = {
      '/': 'Orange Health Ajo | Community Healthcare Savings & Emergency Cash Fund',
      '/login': 'Sign In | Orange Health Ajo',
      '/signup': 'Create Member Account | Orange Health Ajo',
      '/forgot-password': 'Reset Password | Orange Health Ajo',
      '/reset-password': 'Create New Password | Orange Health Ajo',
      '/verify-email': 'Verify Email | Orange Health Ajo',
      '/member': 'Member Portal | Orange Health Ajo',
      '/reception': 'Reception Desk | Orange Health Ajo',
      '/marketer': 'Marketer Dashboard | Orange Health Ajo',
      '/admin': 'Admin Operations | Orange Health Ajo',
    };

    document.title = titleMap[pathname] || 'Orange Health Ajo';
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteMetaHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={['MEMBER']}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reception"
            element={
              <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']}>
                <ReceptionDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketer"
            element={
              <ProtectedRoute allowedRoles={['MARKETER']}>
                <MarketerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all safety redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

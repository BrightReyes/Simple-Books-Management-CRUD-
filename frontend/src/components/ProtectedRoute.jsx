import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  console.log(`[ProtectedRoute] Checking access. Role needed: ${allowedRole}. Loading: ${loading}, IsAuth: ${isAuthenticated}`);

  if (loading) {
    return (
      <div className="spinner">
        <div className="spinner__circle"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn(`[ProtectedRoute] Not authenticated. Redirecting to login.`);
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    console.warn(`[ProtectedRoute] Role mismatch. User role: ${user?.role}. Redirecting to respective dashboard.`);
    // Redirect to the correct dashboard
    const redirectPath = user?.role === 'TEACHER' ? '/teacher' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  console.log(`[ProtectedRoute] Access granted to ${user?.role}`);
  return children;
}

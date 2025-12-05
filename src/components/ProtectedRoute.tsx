import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: ('guest' | 'expert')[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // если не авторизован, гость
    if (allowedRoles.includes('guest')) return <>{children}</>;
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(user.role) ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;

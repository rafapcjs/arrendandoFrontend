import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppLayout } from '../layout/AppLayout';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = sessionStorage.getItem('access_token');
  const userRole = sessionStorage.getItem('user_role');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to 404
  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/404" replace />;
  }
  
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};
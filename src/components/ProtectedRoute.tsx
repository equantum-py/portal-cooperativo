import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  allowedRoles: ('socio' | 'admin')[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const session = authService.getSession();

  if (!session) {
    if (allowedRoles.includes('admin') && !allowedRoles.includes('socio')) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.rol)) {
    if (session.rol === 'socio') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

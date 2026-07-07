import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  type?: 'socio' | 'admin';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, type = 'socio' }) => {
  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-content-wrapper">
        <div className={`auth-card ${type === 'socio' ? 'auth-card-socio' : 'auth-card-admin'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';

interface SocioStatusBadgeProps {
  type: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

const SocioStatusBadge: React.FC<SocioStatusBadgeProps> = ({ type, children }) => {
  const styles = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' },
    info: { bg: 'rgba(3, 170, 229, 0.1)', color: 'var(--color-primary)' }
  };

  return (
    <span 
      className="socio-status-badge" 
      style={{ backgroundColor: styles[type].bg, color: styles[type].color }}
    >
      {children}
    </span>
  );
};

export default SocioStatusBadge;

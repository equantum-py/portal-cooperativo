import React from 'react';

interface SocioStatusBadgeProps {
  type: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

const SocioStatusBadge: React.FC<SocioStatusBadgeProps> = ({ type, children }) => {
  const styles = {
    success: { bg: '#dcfce7', color: '#166534' }, // Premium tailwind colors
    warning: { bg: '#fef3c7', color: '#92400e' },
    danger: { bg: '#fee2e2', color: '#991b1b' },
    info: { bg: '#dbeafe', color: '#1e40af' }
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

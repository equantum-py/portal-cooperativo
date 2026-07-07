import React from 'react';

interface BadgeProps {
  type: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type, children }) => {
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
};

export default Badge;

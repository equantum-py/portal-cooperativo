import React from 'react';

interface SocioEmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

const SocioEmptyState: React.FC<SocioEmptyStateProps> = ({ icon, title, subtitle }) => {
  return (
    <div className="socio-empty-state">
      <i className={`fa-solid ${icon}`}></i>
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: 'var(--color-text)' }}>{title}</h3>
      {subtitle && <p style={{ margin: 0, fontSize: '0.9rem' }}>{subtitle}</p>}
    </div>
  );
};

export default SocioEmptyState;

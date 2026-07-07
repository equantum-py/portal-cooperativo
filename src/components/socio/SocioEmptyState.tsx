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
      <h3 className="socio-empty-title">{title}</h3>
      {subtitle && <p className="socio-empty-desc">{subtitle}</p>}
    </div>
  );
};

export default SocioEmptyState;

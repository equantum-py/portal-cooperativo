import React from 'react';

interface SocioActionGridProps {
  children: React.ReactNode;
}

export const SocioActionGrid: React.FC<SocioActionGridProps> = ({ children }) => {
  return <div className="socio-action-grid">{children}</div>;
};

interface SocioActionPillProps {
  icon: string;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

export const SocioActionPill: React.FC<SocioActionPillProps> = ({ icon, label, primary, onClick }) => {
  return (
    <button className={`socio-action-pill ${primary ? 'primary' : ''}`} onClick={onClick}>
      <i className={`fa-solid ${icon}`}></i>
      {label}
    </button>
  );
};

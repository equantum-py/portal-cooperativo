import React from 'react';

interface SocioHeroCardProps {
  label: string;
  value: string;
  gradient?: 'primary' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
}

const SocioHeroCard: React.FC<SocioHeroCardProps> = ({ label, value, gradient = 'primary', children }) => {
  return (
    <div className="socio-hero-wrapper">
      <div className={`socio-hero-card socio-hero-gradient-${gradient}`}>
        <p className="socio-hero-label">{label}</p>
        <h2 className="socio-hero-value">{value}</h2>
        {children}
      </div>
    </div>
  );
};

export default SocioHeroCard;

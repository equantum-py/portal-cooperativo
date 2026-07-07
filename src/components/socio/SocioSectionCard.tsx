import React from 'react';

interface SocioSectionCardProps {
  title?: string;
  children: React.ReactNode;
}

const SocioSectionCard: React.FC<SocioSectionCardProps> = ({ title, children }) => {
  return (
    <div className="socio-card">
      {title && <h2 className="socio-card-title">{title}</h2>}
      {children}
    </div>
  );
};

export default SocioSectionCard;

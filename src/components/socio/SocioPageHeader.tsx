import React from 'react';

interface SocioPageHeaderProps {
  title: string;
  subtitle?: string;
}

const SocioPageHeader: React.FC<SocioPageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="socio-page-header">
      <h1 className="socio-page-title">{title}</h1>
      {subtitle && <p className="socio-page-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SocioPageHeader;

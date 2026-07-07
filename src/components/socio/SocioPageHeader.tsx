import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SocioPageHeaderProps {
  title: string;
  subtitle?: string;
  dark?: boolean;
}

const SocioPageHeader: React.FC<SocioPageHeaderProps> = ({ title, subtitle, dark = false }) => {
  const navigate = useNavigate();
  return (
    <div className={`socio-page-header ${dark ? 'dark' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: dark ? 'white' : 'var(--color-primary)', fontSize: '1.25rem', padding: '0 1rem 0 0', cursor: 'pointer' }}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="socio-page-title">{title}</h1>
      </div>
      {subtitle && <p className="socio-page-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SocioPageHeader;

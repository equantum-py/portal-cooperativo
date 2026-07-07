import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface SocioAppHeaderProps {
  nombre: string;
}

const SocioAppHeader: React.FC<SocioAppHeaderProps> = ({ nombre }) => {
  const navigate = useNavigate();
  const firstName = nombre.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className="socio-app-header">
      <div>
        <h1 className="socio-app-header-title">Hola, {firstName}</h1>
        <p className="socio-app-header-subtitle">Este es tu resumen como socio</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/dashboard/notificaciones')}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}
        >
          <i className="fa-regular fa-bell"></i>
        </button>
        <div className="socio-app-header-avatar" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          {initial}
        </div>
      </div>
    </header>
  );
};

export default SocioAppHeader;

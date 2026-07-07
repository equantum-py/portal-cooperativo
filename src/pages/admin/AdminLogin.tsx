import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { appConfig } from '../../config/appConfig';
import AuthLayout from '../../components/auth/AuthLayout';

const AdminLogin: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isDemoMode = appConfig.modoDemo;

  useEffect(() => {
    authService.logout();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario.trim()) {
      setError(isDemoMode ? 'Ingresá tu usuario administrativo.' : 'Ingresá tu email administrativo.');
      return;
    }
    if (!password.trim()) {
      setError(isDemoMode ? 'Ingresá tu PIN.' : 'Ingresá tu contraseña.');
      return;
    }
    if (isDemoMode && /^\d+$/.test(usuario.trim())) {
      setError('Este acceso es solo para administradores.');
      return;
    }
    if (!isDemoMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.trim())) {
      setError('Ingresá un email administrativo válido.');
      return;
    }

    try {
      setLoading(true);
      await authService.loginAdmin(usuario.trim(), password.trim());
      navigate('/dashboard/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión administrativa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="admin">
      <div className="auth-brand-icon" style={{ background: 'var(--color-primary)' }}>
        <i className="fa-solid fa-shield-halved"></i>
      </div>
      <h1 className="auth-title">Panel Administrativo</h1>
      <p className="auth-subtitle">{isDemoMode ? 'Gestión financiera y operativa de la cooperativa.' : 'Ingresá con tu email y contraseña de Supabase Auth.'}</p>

      {error && (
        <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} noValidate>
        <div className="auth-input-group">
          <label className="auth-input-label">{isDemoMode ? 'Usuario Administrativo' : 'Email Administrativo'}</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="auth-input" 
              placeholder={isDemoMode ? 'Ej: admin' : 'admin@cooperativa.com'} 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <i className="fa-regular fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
          </div>
        </div>
        
        <div className="auth-input-group">
          <label className="auth-input-label">{isDemoMode ? 'PIN' : 'Contraseña'}</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              className="auth-input" 
              placeholder={isDemoMode ? '1234' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
          </div>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Verificando...' : (isDemoMode ? 'Ingresar al panel demo' : 'Ingresar al panel')}
        </button>
      </form>

      <div className="text-center mt-4">
        <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '1.5rem 0' }} />
        <Link to="/login" className="auth-link">
          <i className="fa-solid fa-arrow-left"></i> Volver al portal del socio
        </Link>
      </div>

      <div className="auth-security-text">
        <i className="fa-solid fa-server"></i> {isDemoMode ? 'Modo demo: usuario admin / PIN 1234' : 'Modo Supabase: acceso exclusivo para administradores activos'}
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;

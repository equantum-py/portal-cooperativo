import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AuthLayout from '../components/auth/AuthLayout';

const Login: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones On Submit
    if (!cedula.trim()) {
      setError('Ingresá tu número de cédula.');
      return;
    }
    if (cedula.trim() === 'admin') {
      setError('Este acceso es solo para socios. Ingresá al panel administrativo desde /admin.');
      return;
    }
    if (!/^\d+$/.test(cedula.trim())) {
      setError('La cédula debe contener solo números.');
      return;
    }
    try {
      setLoading(true);
      await authService.loginSocio(cedula.trim());
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="socio">
      <div className="auth-brand-icon">
        <i className="fa-solid fa-building-columns"></i>
      </div>
      <h1 className="auth-title">Portal de Socios</h1>
      <p className="auth-subtitle">Consultá tus aportes, préstamos y beneficios desde tu celular.</p>

      {error && (
        <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} noValidate>
        <div className="auth-input-group">
          <label className="auth-input-label">Número de Cédula</label>
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Ej: 1234567" 
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
          {!loading && <i className="fa-solid fa-arrow-right"></i>}
        </button>
      </form>

      <div className="text-center mt-4">
        <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '1.5rem 0' }} />
        <p className="text-muted mb-2">¿Aún no sos parte?</p>
        <Link to="/register" className="auth-link">
          Quiero ser socio <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
        </Link>
      </div>

      <div className="auth-security-text">
        <i className="fa-solid fa-shield-halved"></i> Acceso seguro para socios registrados
      </div>
    </AuthLayout>
  );
};

export default Login;

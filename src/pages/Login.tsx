import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar sesión al entrar a la vista de login para evitar mezcla
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
    if (!password.trim()) {
      setError('Ingresá tu contraseña.');
      return;
    }

    try {
      setLoading(true);
      const session = await authService.login(cedula.trim(), password.trim());
      if (session.rol === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="brand-logo text-center mb-4">
          <div className="brand-icon">
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <h1 className="title-lg">Portal de Socios</h1>
          <p className="text-muted">Acceso para socios de la cooperativa</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label">Número de Cédula</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: 1234567" 
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña o PIN</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Ingresá tu clave"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password" style={{ fontSize: '0.9rem' }}>¿Olvidaste tu contraseña?</Link>
        </div>
        
        <div className="text-center mt-4">
          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', marginBottom: '1rem' }} />
          <p className="text-muted mb-2">¿Aún no sos parte?</p>
          <Link to="/register" className="btn btn-outline" style={{ display: 'block' }}>Quiero ser socio</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

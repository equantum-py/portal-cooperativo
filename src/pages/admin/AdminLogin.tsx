import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const AdminLogin: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario.trim()) {
      setError('Ingresá tu usuario o cédula administrativa.');
      return;
    }
    if (!password.trim()) {
      setError('Ingresá tu contraseña o PIN.');
      return;
    }

    try {
      setLoading(true);
      // Reutilizamos el login actual, admin entra con 'admin'
      const session = await authService.login(usuario.trim(), password.trim());
      if (session.rol === 'admin') {
        navigate('/dashboard/admin');
      } else {
        // Un socio intentó entrar por /admin
        // Podemos redirigirlo a su dashboard o darle error de permisos.
        // El requerimiento dice: "Si un admin intenta entrar al portal socio, puede redirigir... pero su acceso principal debe ser /admin"
        // Redirijamos a /dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión administrativa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="auth-card" style={{ borderTop: '5px solid var(--color-primary)' }}>
        <div className="brand-logo text-center mb-4">
          <div className="brand-icon" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="title-lg">Panel Administrativo</h1>
          <p className="text-muted">Acceso para responsables de gestión financiera y operativa</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label">Usuario o Cédula Administrativa</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: admin" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña o PIN</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verificando...' : 'Ingresar al panel'}
          </button>
        </form>

        <div className="text-center mt-4">
          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', marginBottom: '1rem' }} />
          <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', textDecoration: 'none' }}>
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Volver al portal del socio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

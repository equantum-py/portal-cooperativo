import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { delay } from '../services/authService';

const ForgotPassword: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cedula.trim()) {
      setError('Ingresá tu número de cédula.');
      return;
    }
    if (!/^\d+$/.test(cedula.trim())) {
      setError('La cédula debe contener solo números.');
      return;
    }
    if (!telefono.trim()) {
      setError('Ingresá tu teléfono.');
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('El correo no tiene un formato válido.');
      return;
    }

    try {
      setLoading(true);
      await delay(); // Simular envío
      alert('Solicitud enviada. Te enviaremos un SMS o correo con las instrucciones.');
      navigate('/login');
    } catch {
      setError('Hubo un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-3">
          <h1 className="title-md">Recuperar Acceso</h1>
          <p className="text-muted">Ingresá tus datos para restablecer tu contraseña.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Número de Cédula</label>
            <input type="text" className="form-control" placeholder="Ej: 1234567" value={cedula} onChange={e => setCedula(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Número de Teléfono</label>
            <input type="tel" className="form-control" placeholder="Ej: 0981 123 456" value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico (Opcional)</label>
            <input type="email" className="form-control" placeholder="ejemplo@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-secondary mt-2" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-muted"><i className="fa-solid fa-arrow-left"></i> Volver al Inicio de Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

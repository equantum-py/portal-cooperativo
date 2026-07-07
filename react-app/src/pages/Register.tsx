import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { delay } from '../services/authService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ nombre: '', cedula: '', telefono: '', email: '', ciudad: '', mensaje: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) { setError('Ingresá tu nombre completo.'); return; }
    if (!formData.cedula.trim()) { setError('Ingresá tu número de cédula.'); return; }
    if (!/^\d+$/.test(formData.cedula.trim())) { setError('La cédula debe contener solo números.'); return; }
    if (!formData.telefono.trim()) { setError('Ingresá tu teléfono.'); return; }
    if (!formData.email.trim()) { setError('Ingresá tu correo electrónico.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) { setError('El correo no tiene un formato válido.'); return; }
    if (!formData.ciudad.trim()) { setError('Ingresá tu ciudad.'); return; }

    try {
      setLoading(true);
      await delay();
      alert('¡Solicitud enviada con éxito! Pronto un asesor se pondrá en contacto.');
      navigate('/login');
    } catch {
      setError('Hubo un error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-3">
          <h1 className="title-md">Quiero ser socio</h1>
          <p className="text-muted">Completá tus datos y un asesor se comunicará contigo para ayudarte con el proceso de asociación.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input type="text" name="nombre" className="form-control" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Número de Cédula</label>
            <input type="text" name="cedula" className="form-control" placeholder="Ej: 1234567" value={formData.cedula} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="telefono" className="form-control" placeholder="Ej: 0981 123 456" value={formData.telefono} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" name="email" className="form-control" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Ciudad</label>
            <input type="text" name="ciudad" className="form-control" placeholder="Ej: Asunción" value={formData.ciudad} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mensaje o motivo (Opcional)</label>
            <textarea name="mensaje" className="form-control" rows={3} placeholder="¿Por qué te gustaría unirte?" value={formData.mensaje} onChange={handleChange}></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
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

export default Register;

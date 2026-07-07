import React, { useState } from 'react';
import { demoStore } from '../../services/demoStore';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminNotificaciones: React.FC = () => {
  const [socios] = useState(demoStore.getSocios());
  const [history, setHistory] = useState(demoStore.getAdminNotifications());
  const { showToast } = useToast();

  const [form, setForm] = useState({
    destinatario: 'todos',
    tipo: 'info',
    titulo: '',
    mensaje: '',
    prioridad: 'normal',
    canal: 'app'
  });

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const plantillas = demoStore.getPlantillas();
    const p = plantillas.find(x => x.id === val);
    if (p) {
      setForm({ ...form, tipo: p.tipo, titulo: p.titulo, mensaje: p.mensaje });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.mensaje.trim()) {
      showToast('Por favor completá el título y el mensaje.', 'error');
      return;
    }
    
    demoStore.sendNotification(form);
    showToast('Notificación enviada con éxito', 'success');
    setHistory(demoStore.getAdminNotifications());
    setForm({ ...form, titulo: '', mensaje: '' });
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Centro de Notificaciones</h1>
        <p className="text-muted">Enviá comunicados, alertas de mora y avisos a los socios.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Formulario de envío */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Redactar Mensaje</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Destinatario</label>
              <select className="form-control" value={form.destinatario} onChange={e => setForm({...form, destinatario: e.target.value})}>
                <option value="todos">Todos los socios</option>
                <option value="activos">Solo socios Activos</option>
                <option value="atrasados">Socios con Atrasos</option>
                <optgroup label="Socio Específico">
                  {socios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} ({s.numeroSocio})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Usar Plantilla Rápida</label>
              <select className="form-control" onChange={handleTemplateChange} defaultValue="">
                <option value="" disabled>Seleccioná una plantilla (Opcional)</option>
                {demoStore.getPlantillas().map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Tipo Visual</label>
                <select className="form-control" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="info">Información (Azul)</option>
                  <option value="success">Éxito / Oferta (Verde)</option>
                  <option value="warning">Advertencia (Amarillo)</option>
                  <option value="danger">Urgente / Mora (Rojo)</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Canal</label>
                <select className="form-control" value={form.canal} onChange={e => setForm({...form, canal: e.target.value})}>
                  <option value="app">App Portal</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Título de Notificación</label>
              <input type="text" className="form-control" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej: Aviso Importante" />
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea className="form-control" rows={4} required value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} placeholder="Escribí el cuerpo del mensaje acá..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.5rem' }}></i> Enviar Notificación
            </button>
          </form>
        </div>

        {/* Historial */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <h2 className="title-md" style={{ padding: '2rem 2rem 0', marginBottom: '1rem', color: 'var(--color-primary)' }}>Historial de Envíos</h2>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 2rem 2rem' }}>
            {history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map(notif => (
                  <div key={notif.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{notif.titulo}</strong>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{notif.fecha}</span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{notif.mensaje}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Badge type={notif.tipo}>{notif.tipo}</Badge>
                      <Badge type="info"><i className="fa-solid fa-tower-broadcast" style={{ marginRight: '4px' }}></i>{notif.canal}</Badge>
                      <Badge type="info"><i className="fa-solid fa-users" style={{ marginRight: '4px' }}></i>{
                        notif.destinatario === 'todos' ? 'Todos' :
                        notif.destinatario === 'atrasados' ? 'Atrasados' :
                        notif.destinatario === 'activos' ? 'Activos' : 'Socio Específico'
                      }</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>No hay notificaciones enviadas todavía.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminNotificaciones;

import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { useToast } from '../../context/ToastContext';

const AdminConfiguracion: React.FC = () => {
  const { showToast } = useToast();
  
  // -- Configuración Global --
  const [config, setConfig] = useState<any>(null);

  // -- Plantillas --
  const [plantillas, setPlantillas] = useState<any[]>([]);
  const [selectedPlantilla, setSelectedPlantilla] = useState<string | null>(null);

  useEffect(() => {
    setConfig(demoStore.getConfiguracion());
    const p = demoStore.getPlantillas();
    setPlantillas(p);
    if (p.length > 0) setSelectedPlantilla(p[0].id);
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    demoStore.saveConfiguracion(config);
    showToast('Configuración general guardada', 'success');
  };

  const handleRestoreConfig = () => {
    localStorage.removeItem('demoConfiguracion');
    setConfig(demoStore.getConfiguracion());
    showToast('Valores por defecto restaurados', 'info');
  };

  const handleSavePlantillas = (e: React.FormEvent) => {
    e.preventDefault();
    demoStore.savePlantillas(plantillas);
    showToast('Plantillas de notificación guardadas', 'success');
  };

  const handleTestPlantilla = () => {
    if (!selectedPlantilla) return;
    const p = plantillas.find(x => x.id === selectedPlantilla);
    if (p) {
      demoStore.sendNotification({
        destinatario: 'admin', // Simular que se manda al admin para no ensuciar a los socios
        tipo: p.tipo,
        titulo: p.titulo,
        mensaje: p.mensaje,
        prioridad: 'normal',
        canal: 'app'
      });
      showToast(`Prueba de plantilla "${p.nombre}" enviada`, 'info');
    }
  };

  const updatePlantilla = (field: string, value: string) => {
    setPlantillas(prev => prev.map(p => {
      if (p.id === selectedPlantilla) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const activePlantilla = plantillas.find(p => p.id === selectedPlantilla);

  if (!config) return <div>Cargando...</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Configuración del Sistema</h1>
        <p className="text-muted">Ajustes generales, variables de entorno simuladas y plantillas.</p>
      </div>

      {/* Variables de Sistema (Info) */}
      <div className="card mb-4" style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)' }}>
        <h3 className="title-sm" style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>
          <i className="fa-solid fa-server" style={{ marginRight: '0.5rem' }}></i> Entorno Activo
        </h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <small className="text-muted" style={{ display: 'block' }}>Modo de Ejecución</small>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Demo (Local Storage)</span>
          </div>
          <div>
            <small className="text-muted" style={{ display: 'block' }}>Base de Datos</small>
            <span style={{ color: 'var(--color-text-light)' }}>Supabase (Pendiente)</span>
          </div>
          <div>
            <small className="text-muted" style={{ display: 'block' }}>Canales Habilitados</small>
            <span style={{ color: 'var(--color-primary)' }}>App</span>
            <span style={{ color: 'var(--color-text-light)', marginLeft: '0.5rem', textDecoration: 'line-through' }}>WhatsApp, Email, SMS</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* FORMULARIO CONFIG GENERAL */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Ajustes de la Institución
          </h2>
          <form onSubmit={handleSaveConfig}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              {/* Institucional */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nombre de la Cooperativa</label>
                <input type="text" className="form-control" value={config.nombreCooperativa} onChange={e => setConfig({...config, nombreCooperativa: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre del Portal</label>
                <input type="text" className="form-control" value={config.nombrePortal} onChange={e => setConfig({...config, nombrePortal: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Administrador Principal</label>
                <input type="text" className="form-control" value={config.nombreAdmin} onChange={e => setConfig({...config, nombreAdmin: e.target.value})} />
              </div>

              {/* Contacto */}
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="text" className="form-control" value={config.telefono} onChange={e => setConfig({...config, telefono: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input type="text" className="form-control" value={config.whatsapp} onChange={e => setConfig({...config, whatsapp: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={config.email} onChange={e => setConfig({...config, email: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Dirección</label>
                <input type="text" className="form-control" value={config.direccion} onChange={e => setConfig({...config, direccion: e.target.value})} />
              </div>

              {/* Financiero */}
              <div className="form-group">
                <label className="form-label">Aporte Mensual Defecto</label>
                <input type="number" className="form-control" value={config.montoAporteDefecto} onChange={e => setConfig({...config, montoAporteDefecto: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Día Vencimiento Aporte</label>
                <input type="number" className="form-control" min="1" max="28" value={config.diaVencimientoAporte} onChange={e => setConfig({...config, diaVencimientoAporte: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Interés Préstamo (%)</label>
                <input type="number" className="form-control" value={config.interesDemo} onChange={e => setConfig({...config, interesDemo: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Moneda Base</label>
                <input type="text" className="form-control" value={config.moneda} onChange={e => setConfig({...config, moneda: e.target.value})} />
              </div>

            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={handleRestoreConfig} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                Restaurar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Guardar Configuración
              </button>
            </div>
          </form>
        </div>

        {/* FORMULARIO PLANTILLAS */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Plantillas de Notificación
          </h2>
          <form onSubmit={handleSavePlantillas}>
            
            <div className="form-group mb-4">
              <label className="form-label">Seleccionar Plantilla a Editar</label>
              <select className="form-control" value={selectedPlantilla || ''} onChange={e => setSelectedPlantilla(e.target.value)}>
                {plantillas.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {activePlantilla && (
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Título de la Notificación</label>
                  <input type="text" className="form-control" value={activePlantilla.titulo} onChange={e => updatePlantilla('titulo', e.target.value)} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cuerpo del Mensaje</label>
                  <textarea className="form-control" rows={4} value={activePlantilla.mensaje} onChange={e => updatePlantilla('mensaje', e.target.value)} required></textarea>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Tipo Visual</label>
                  <select className="form-control" value={activePlantilla.tipo} onChange={e => updatePlantilla('tipo', e.target.value)}>
                    <option value="info">Informativo (Celeste)</option>
                    <option value="success">Éxito (Verde)</option>
                    <option value="warning">Advertencia (Amarillo)</option>
                    <option value="danger">Alerta / Error (Rojo)</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={handleTestPlantilla}>
                Probar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Guardar Plantillas
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminConfiguracion;

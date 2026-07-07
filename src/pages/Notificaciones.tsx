import React, { useState, useEffect } from 'react';
import { demoStore } from '../services/demoStore';
import { authService } from '../services/authService';
import { Notificacion } from '../data/mockData';

const Notificaciones: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    const session = authService.getSession();
    const socios = demoStore.getSocios();
    const socio = socios.find(s => s.cedula === session?.cedula);
    if (socio) {
      setNotificaciones(socio.notificaciones);
    }
  }, []);

  return (
    <div>
      <h1 className="title-lg mb-3">Notificaciones</h1>
      
      <div>
        {notificaciones.length === 0 ? (
          <p className="text-muted">No tenés notificaciones nuevas.</p>
        ) : (
          notificaciones.map((notif) => {
            let icon = '';
            let color = '';
            if (notif.tipo === 'warning') { icon = 'fa-triangle-exclamation'; color = 'var(--color-warning)'; }
            else if (notif.tipo === 'danger') { icon = 'fa-circle-xmark'; color = 'var(--color-danger)'; }
            else if (notif.tipo === 'success') { icon = 'fa-circle-check'; color = 'var(--color-success)'; }
            else { icon = 'fa-circle-info'; color = 'var(--color-info)'; }

            return (
              <div key={notif.id} className="card mb-2" style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', color, marginRight: '1rem', marginTop: '5px' }}>
                  <i className={`fa-solid ${icon}`}></i>
                </div>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>{notif.titulo}</h4>
                  <p className="text-muted" style={{ marginBottom: '5px' }}>{notif.mensaje}</p>
                  <small className="text-muted">{notif.fecha}</small>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notificaciones;

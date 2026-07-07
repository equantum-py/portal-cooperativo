import React from 'react';
import { mockUser } from '../data/mockData';

const Notificaciones: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Notificaciones</h1>
      
      <div>
        {mockUser.notificaciones.length === 0 ? (
          <p className="text-muted">No tenés notificaciones nuevas.</p>
        ) : (
          mockUser.notificaciones.map((notif) => {
            let icon = '';
            let color = '';
            if (notif.tipo === 'warning') { icon = 'fa-triangle-exclamation'; color = 'var(--color-warning)'; }
            else if (notif.tipo === 'danger') { icon = 'fa-circle-xmark'; color = 'var(--color-danger)'; }
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

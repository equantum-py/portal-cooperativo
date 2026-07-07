import React, { useState, useEffect } from 'react';
import { demoStore } from '../services/demoStore';
import { authService } from '../services/authService';
import { Notificacion } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioEmptyState from '../components/socio/SocioEmptyState';

const Notificaciones: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    const session = authService.getSession();
    const socios = demoStore.getSocios();
    const socio = socios.find(s => s.cedula === session?.cedula);
    if (socio) {
      setNotificaciones(socio.notificaciones);
    }
  }, []);

  const chips = ['Todas', 'Mora', 'Aportes', 'Préstamos', 'Beneficios'];

  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Notificaciones" 
        subtitle="Centro de mensajes y alertas" 
      />

      <div className="socio-chip-list">
        {chips.map(chip => (
          <div 
            key={chip} 
            className={`socio-chip ${filter === chip ? 'active' : ''}`}
            onClick={() => setFilter(chip)}
          >
            {chip}
          </div>
        ))}
      </div>
      
      <div className="socio-section-title-wrapper">
        {notificaciones.length === 0 ? (
          <SocioEmptyState 
            icon="fa-bell-slash" 
            title="Bandeja Vacía" 
            subtitle="No tenés notificaciones pendientes." 
          />
        ) : (
          notificaciones.map((notif) => {
            let icon = '';
            let iconColor = '';
            let bgLight = '';

            if (notif.tipo === 'warning') { 
              icon = 'fa-triangle-exclamation'; 
              iconColor = 'var(--color-warning)'; 
              bgLight = '#FEF0C7';
            } else if (notif.tipo === 'danger') { 
              icon = 'fa-circle-xmark'; 
              iconColor = 'var(--color-danger)'; 
              bgLight = '#FEE4E2';
            } else if (notif.tipo === 'success') { 
              icon = 'fa-circle-check'; 
              iconColor = 'var(--color-success)'; 
              bgLight = '#D1FADF';
            } else { 
              icon = 'fa-bell'; 
              iconColor = 'var(--color-info)'; 
              bgLight = '#E0F2FE';
            }

            return (
              <div key={notif.id} className="socio-finance-card" style={{ position: 'relative', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '1.25rem', color: iconColor, marginRight: '1rem', 
                    backgroundColor: bgLight, width: '46px', height: '46px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px',
                    flexShrink: 0
                  }}>
                    <i className={`fa-solid ${icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{notif.titulo}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{notif.fecha}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {notif.mensaje}
                    </p>
                  </div>
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

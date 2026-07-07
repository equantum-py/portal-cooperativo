import React, { useState, useEffect } from 'react';
import { demoStore } from '../services/demoStore';
import { authService } from '../services/authService';
import { Notificacion } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioEmptyState from '../components/socio/SocioEmptyState';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';

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
    <div className="socio-page">
      <SocioPageHeader 
        title="Notificaciones" 
        subtitle="Avisos importantes de la cooperativa" 
      />

      <div className="socio-chip-list">
        <div className="socio-chip active">Todas</div>
        <div className="socio-chip">Mora</div>
        <div className="socio-chip">Aportes</div>
        <div className="socio-chip">Préstamos</div>
        <div className="socio-chip">Beneficios</div>
      </div>
      
      <div style={{ padding: '0 1rem' }}>
        {notificaciones.length === 0 ? (
          <SocioEmptyState 
            icon="fa-bell-slash" 
            title="Sin notificaciones" 
            subtitle="Te avisaremos cuando haya novedades importantes." 
          />
        ) : (
          notificaciones.map((notif) => {
            let icon = '';
            let iconColor = '';
            let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'info';

            if (notif.tipo === 'warning') { 
              icon = 'fa-triangle-exclamation'; 
              iconColor = 'var(--color-warning)'; 
              badgeType = 'warning';
            } else if (notif.tipo === 'danger') { 
              icon = 'fa-circle-xmark'; 
              iconColor = 'var(--color-danger)'; 
              badgeType = 'danger';
            } else if (notif.tipo === 'success') { 
              icon = 'fa-circle-check'; 
              iconColor = 'var(--color-success)'; 
              badgeType = 'success';
            } else { 
              icon = 'fa-circle-info'; 
              iconColor = 'var(--color-primary)'; 
              badgeType = 'info';
            }

            return (
              <div key={notif.id} className="socio-card" style={{ padding: '1.25rem', marginBottom: '1rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1.25rem' }}>
                  <SocioStatusBadge type={badgeType}>{notif.fecha}</SocioStatusBadge>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: '1.25rem', color: iconColor, marginRight: '1rem', 
                    backgroundColor: 'rgba(0,0,0,0.03)', width: '40px', height: '40px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' 
                  }}>
                    <i className={`fa-solid ${icon}`}></i>
                  </div>
                  <div style={{ flex: 1, paddingRight: '4rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600 }}>{notif.titulo}</h4>
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

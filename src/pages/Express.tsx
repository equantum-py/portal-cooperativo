import React from 'react';
import { mockUser } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioHeroCard from '../components/socio/SocioHeroCard';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import { SocioActionGrid, SocioActionPill } from '../components/socio/SocioActionGrid';

const Express: React.FC = () => {
  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Préstamo Express" 
        subtitle="Adelantos de efectivo instantáneos" 
      />
      
      {mockUser.calificaPrestamoExpress ? (
        <SocioHeroCard 
          label="Pre-Aprobado"
          value="Gs. 1.000.000"
          gradient="success"
        >
          <div style={{ marginTop: '1rem', paddingBottom: '0.5rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', opacity: 0.9 }}>
              Calificás para un retiro inmediato por tu excelente historial.
            </p>
          </div>
        </SocioHeroCard>
      ) : (
        <SocioHeroCard 
          label="En Revisión"
          value="Gs. 0"
          gradient="warning"
        >
          <div style={{ marginTop: '1rem', paddingBottom: '0.5rem' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', opacity: 0.9 }}>
              Necesitás regularizar tus aportes para acceder a este beneficio.
            </p>
          </div>
        </SocioHeroCard>
      )}

      {mockUser.calificaPrestamoExpress ? (
        <SocioActionGrid>
          <div style={{ gridColumn: '1 / -1' }}>
            <SocioActionPill primary icon="fa-bolt" label="Solicitar Adelanto Ahora" onClick={() => alert('Solicitando...')} />
          </div>
        </SocioActionGrid>
      ) : (
        <SocioActionGrid>
          <div style={{ gridColumn: '1 / -1' }}>
            <SocioActionPill primary icon="fa-file-invoice-dollar" label="Pagar Deudas Pendientes" onClick={() => window.location.href='/dashboard/pagos'} />
          </div>
        </SocioActionGrid>
      )}

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', marginTop: '1rem' }}>
          Beneficios del Express
        </h3>
      </div>

      <SocioFinanceCard>
        <div className="socio-movement-list">
          <SocioMovementItem 
            icon="fa-stopwatch"
            iconColor="primary"
            title="Aprobación en segundos"
            date="Sin trámites, 100% automático."
            amount=""
          />
          <SocioMovementItem 
            icon="fa-mobile-screen"
            iconColor="success"
            title="Acreditación Digital"
            date="Directo a tu caja de ahorro."
            amount=""
          />
          <SocioMovementItem 
            icon="fa-percent"
            iconColor="warning"
            title="Tasa Preferencial"
            date="Beneficio exclusivo para socios al día."
            amount=""
          />
        </div>
      </SocioFinanceCard>
    </div>
  );
};

export default Express;

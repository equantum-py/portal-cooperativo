import React from 'react';
import { mockUser } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';

const Express: React.FC = () => {
  return (
    <div className="socio-page">
      <SocioPageHeader 
        title="Préstamo Express" 
        subtitle="Dinero rápido y sin papeleos" 
      />
      
      {mockUser.calificaPrestamoExpress ? (
        <div className="socio-balance-card" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
            <i className="fa-solid fa-bolt"></i>
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>¡Calificás ahora!</h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '280px', margin: '0 auto 2rem' }}>
            Tenés pre-aprobado un préstamo express gracias a tu excelente historial de aportes.
          </p>
          <button className="socio-cta-btn socio-cta-secondary" style={{ color: 'var(--color-success)' }} onClick={() => alert('Funcionalidad de solicitud en desarrollo.')}>
            Solicitar Adelanto
          </button>
        </div>
      ) : (
        <div className="socio-balance-card" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>En Revisión</h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '280px', margin: '0 auto 2rem' }}>
            Para acceder a este beneficio, necesitás regularizar tus aportes o cuotas pendientes.
          </p>
          <button className="socio-cta-btn socio-cta-secondary" style={{ color: 'var(--color-warning)' }} onClick={() => window.location.href='/dashboard/aportes'}>
            Regularizar Estado
          </button>
        </div>
      )}
      
      <SocioSectionCard title="Beneficios">
        <div className="socio-movement-list">
          <div className="socio-movement-item">
            <div className="socio-movement-icon" style={{ backgroundColor: 'rgba(3,170,229,0.1)', color: 'var(--color-primary)' }}>
              <i className="fa-solid fa-stopwatch"></i>
            </div>
            <div className="socio-movement-content">
              <p className="socio-movement-title">Aprobación instantánea</p>
              <p className="socio-movement-date">Sin trámites ni demoras.</p>
            </div>
          </div>
          <div className="socio-movement-item">
            <div className="socio-movement-icon" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
              <i className="fa-solid fa-mobile-screen"></i>
            </div>
            <div className="socio-movement-content">
              <p className="socio-movement-title">100% Digital</p>
              <p className="socio-movement-date">Desde la comodidad de tu celular.</p>
            </div>
          </div>
        </div>
      </SocioSectionCard>
    </div>
  );
};

export default Express;

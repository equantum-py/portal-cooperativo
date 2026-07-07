import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';

const Pagos: React.FC = () => {
  const isAtrasado = mockUser.aportesAtrasadosMonto > 0 || mockUser.cuotasVencidas > 0;
  
  return (
    <div className="socio-page">
      <SocioPageHeader 
        title="Pagos Pendientes" 
        subtitle="Resumen de compromisos a abonar" 
      />
      
      <div className="socio-balance-card" style={{ background: isAtrasado ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', boxShadow: isAtrasado ? '0 10px 25px -5px rgba(239, 68, 68, 0.4)' : '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
        <p className="socio-balance-title">Total a Pagar</p>
        <h2 className="socio-balance-amount">{formatCurrency(mockUser.pagoPendiente)}</h2>
        <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.8 }}>
          <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: '2rem' }}></i>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Próximo Vencimiento</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{mockUser.fechaProximoVencimiento}</p>
          </div>
          {isAtrasado && (
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
              CON ATRASOS
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
        <button className="socio-cta-btn socio-cta-primary" style={{ flex: 1, padding: '0.85rem' }}>
          Pagar Todo
        </button>
        <button className="socio-cta-btn socio-cta-secondary" style={{ width: '50px', flex: 'none', padding: '0.85rem' }}>
          <i className="fa-solid fa-file-pdf"></i>
        </button>
      </div>

      <SocioSectionCard title="Detalle de Deuda">
        <div className="socio-movement-list">
          <SocioMovementItem 
            icon="fa-piggy-bank"
            iconColor={mockUser.aportesAtrasadosMonto > 0 ? 'danger' : 'primary'}
            title="Aporte Mensual"
            date="Mes actual"
            amount={formatCurrency(mockUser.aporteMensual)}
            rightAddon={
              mockUser.aportesAtrasadosMonto > 0 
                ? <SocioStatusBadge type="danger">Mora</SocioStatusBadge>
                : <SocioStatusBadge type="success">Vigente</SocioStatusBadge>
            }
          />
          <SocioMovementItem 
            icon="fa-hand-holding-dollar"
            iconColor={mockUser.cuotasVencidas > 0 ? 'danger' : 'primary'}
            title="Cuota de Préstamo"
            date={mockUser.fechaProximoVencimiento}
            amount={formatCurrency(mockUser.montoProximaCuota)}
            rightAddon={
              mockUser.cuotasVencidas > 0 
                ? <SocioStatusBadge type="danger">Vencido</SocioStatusBadge>
                : <SocioStatusBadge type="success">Vigente</SocioStatusBadge>
            }
          />
        </div>
      </SocioSectionCard>
    </div>
  );
};

export default Pagos;

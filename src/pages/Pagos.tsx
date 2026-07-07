import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioHeroCard from '../components/socio/SocioHeroCard';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import { SocioActionGrid, SocioActionPill } from '../components/socio/SocioActionGrid';

const Pagos: React.FC = () => {
  const isAtrasado = mockUser.aportesAtrasadosMonto > 0 || mockUser.cuotasVencidas > 0;
  
  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Pagos Pendientes" 
        subtitle="Resumen de compromisos a abonar" 
      />
      
      <SocioHeroCard 
        label="Total a Pagar"
        value={formatCurrency(mockUser.pagoPendiente)}
        gradient="primary"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingBottom: '0.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Próximo Vencimiento</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>{mockUser.fechaProximoVencimiento}</p>
          </div>
          {isAtrasado && (
            <span style={{ backgroundColor: '#FEE4E2', color: 'var(--color-danger)', padding: '0.4rem 0.85rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(217, 45, 32, 0.2)' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              CON ATRASOS
            </span>
          )}
        </div>
      </SocioHeroCard>

      <SocioActionGrid>
        <SocioActionPill primary icon="fa-credit-card" label="Pagar Todo" onClick={() => alert('Pagar')} />
        <SocioActionPill icon="fa-file-pdf" label="Extracto" onClick={() => alert('Extracto')} />
      </SocioActionGrid>

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>
          Detalle de Deuda
        </h3>
      </div>

      <SocioFinanceCard>
        <div className="socio-movement-list">
          <SocioMovementItem 
            icon="fa-piggy-bank"
            iconColor={mockUser.aportesAtrasadosMonto > 0 ? 'danger' : 'primary'}
            title="Aporte Mensual"
            date="Mes actual"
            amount={formatCurrency(mockUser.aporteMensual)}
            status={
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
            status={
              mockUser.cuotasVencidas > 0 
                ? <SocioStatusBadge type="danger">Vencido</SocioStatusBadge>
                : <SocioStatusBadge type="success">Vigente</SocioStatusBadge>
            }
          />
        </div>
      </SocioFinanceCard>
    </div>
  );
};

export default Pagos;

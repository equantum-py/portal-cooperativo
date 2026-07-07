import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioHeroCard from '../components/socio/SocioHeroCard';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import SocioEmptyState from '../components/socio/SocioEmptyState';
import { SocioActionGrid, SocioActionPill } from '../components/socio/SocioActionGrid';
import SocioInfoRow from '../components/socio/SocioInfoRow';

const Prestamos: React.FC = () => {
  const isAtrasado = mockUser.cuotasVencidas > 0;

  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Mis Préstamos" 
        subtitle="Administrá tus créditos activos" 
      />
      
      <SocioHeroCard 
        label="Préstamo Vigente"
        value={formatCurrency(mockUser.prestamoConcedido)}
        gradient="primary"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Próximo Vencimiento</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>{mockUser.fechaProximoVencimiento}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Cuota a Pagar</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text)' }}>{formatCurrency(mockUser.montoProximaCuota)}</p>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {isAtrasado ? (
            <span style={{ backgroundColor: '#FEE4E2', color: 'var(--color-danger)', padding: '0.4rem 0.85rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(217, 45, 32, 0.2)' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              {mockUser.cuotasVencidas} cuota{mockUser.cuotasVencidas !== 1 ? 's' : ''} vencida{mockUser.cuotasVencidas !== 1 ? 's' : ''}
            </span>
          ) : (
            <span style={{ backgroundColor: '#D1FADF', color: 'var(--color-success)', padding: '0.4rem 0.85rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(18, 183, 106, 0.2)' }}>
              <i className="fa-solid fa-check-circle"></i>
              Crédito al Día
            </span>
          )}
        </div>
      </SocioHeroCard>

      <SocioActionGrid>
        <SocioActionPill primary icon="fa-hand-holding-dollar" label="Pagar Cuota" onClick={() => alert('Ir a pago')} />
        <SocioActionPill icon="fa-list" label="Ver Plan" onClick={() => alert('Ver amortización')} />
      </SocioActionGrid>

      <SocioFinanceCard title="Progreso del Préstamo">
        <SocioInfoRow label="Cuotas Pagadas" value={`${mockUser.cuotasPagadas} cuotas`} />
        <SocioInfoRow label="Cuotas Pendientes" value={`${mockUser.cuotasPendientes} cuotas`} />
        {isAtrasado && (
          <SocioInfoRow 
            label={<span style={{ color: 'var(--color-danger)' }}>Cuotas Vencidas</span>} 
            value={<span style={{ color: 'var(--color-danger)' }}>{mockUser.cuotasVencidas} cuotas</span>} 
          />
        )}
      </SocioFinanceCard>

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>
          Historial de Cuotas
        </h3>
      </div>

      <SocioFinanceCard>
        {mockUser.historialPrestamos.length > 0 ? (
          <div className="socio-movement-list">
            {mockUser.historialPrestamos.map(prestamo => {
              let iconColor: 'success' | 'warning' | 'danger' = 'success';
              let badgeType: 'success' | 'warning' | 'danger' = 'success';
              
              if (prestamo.estado === 'pendiente') {
                iconColor = 'warning';
                badgeType = 'warning';
              } else if (prestamo.estado === 'vencido') {
                iconColor = 'danger';
                badgeType = 'danger';
              }

              return (
                <SocioMovementItem 
                  key={prestamo.id}
                  icon="fa-file-invoice-dollar"
                  iconColor={iconColor}
                  title={`Cuota ${prestamo.cuota}`}
                  date={prestamo.vencimiento}
                  amount={formatCurrency(prestamo.monto)}
                  status={
                    <SocioStatusBadge type={badgeType}>
                      {prestamo.estado}
                    </SocioStatusBadge>
                  }
                />
              );
            })}
          </div>
        ) : (
          <SocioEmptyState 
            icon="fa-file-invoice" 
            title="Aún no hay cuotas registradas" 
          />
        )}
      </SocioFinanceCard>
    </div>
  );
};

export default Prestamos;

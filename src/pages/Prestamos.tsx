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
        gradient={isAtrasado ? 'danger' : 'primary'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Próximo Vencimiento</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{mockUser.fechaProximoVencimiento}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Cuota a Pagar</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>{formatCurrency(mockUser.montoProximaCuota)}</p>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {isAtrasado ? (
            <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>
              {mockUser.cuotasVencidas} cuotas vencidas
            </span>
          ) : (
            <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="fa-solid fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
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

      <div style={{ padding: '0 1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', marginTop: '1rem' }}>
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

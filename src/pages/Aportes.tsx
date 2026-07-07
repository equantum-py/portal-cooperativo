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

const Aportes: React.FC = () => {
  const isAtrasado = mockUser.aportesAtrasadosMeses > 0;

  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Mis Aportes" 
        subtitle="Estado actualizado de tu cuenta capital" 
      />
      
      <SocioHeroCard 
        label="Aporte Mensual"
        value={formatCurrency(mockUser.aporteMensual)}
        gradient={isAtrasado ? 'danger' : 'primary'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Estado Actual</p>
            {isAtrasado 
              ? <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>Atrasado ({mockUser.aportesAtrasadosMeses} meses)</span>
              : <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>Al Día</span>}
          </div>
          {isAtrasado && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Deuda</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>{formatCurrency(mockUser.aportesAtrasadosMonto)}</p>
            </div>
          )}
        </div>
      </SocioHeroCard>

      <SocioActionGrid>
        {isAtrasado ? (
          <SocioActionPill primary icon="fa-credit-card" label="Pagar Deuda" onClick={() => alert('Ir a pago')} />
        ) : (
          <SocioActionPill primary icon="fa-credit-card" label="Adelantar Pago" onClick={() => alert('Ir a pago')} />
        )}
        <SocioActionPill icon="fa-file-pdf" label="Extracto" onClick={() => alert('Descargar PDF')} />
      </SocioActionGrid>

      <SocioFinanceCard title="Resumen Anual">
        <SocioInfoRow label="Meses Pagados" value={mockUser.mesesPagadosAporte} />
        <SocioInfoRow label="Meses Pendientes" value={mockUser.mesesPendientesAporte} />
        <SocioInfoRow label="Categoría" value="Socio Activo" />
      </SocioFinanceCard>

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', marginTop: '1rem' }}>
          Historial de Movimientos
        </h3>
      </div>

      <SocioFinanceCard>
        {mockUser.historialAportes.length > 0 ? (
          <div className="socio-movement-list">
            {mockUser.historialAportes.map(aporte => {
              let iconColor: 'success' | 'warning' | 'danger' = 'success';
              let badgeType: 'success' | 'warning' | 'danger' = 'success';
              
              if (aporte.estado === 'pendiente') {
                iconColor = 'warning';
                badgeType = 'warning';
              } else if (aporte.estado === 'atrasado') {
                iconColor = 'danger';
                badgeType = 'danger';
              }

              return (
                <SocioMovementItem 
                  key={aporte.id}
                  icon="fa-piggy-bank"
                  iconColor={iconColor}
                  title={`Aporte ${aporte.mes}`}
                  date={aporte.fechaPago || 'Pendiente de pago'}
                  amount={formatCurrency(aporte.monto)}
                  status={
                    <SocioStatusBadge type={badgeType}>
                      {aporte.estado}
                    </SocioStatusBadge>
                  }
                />
              );
            })}
          </div>
        ) : (
          <SocioEmptyState 
            icon="fa-receipt" 
            title="Sin movimientos" 
            subtitle="Tus aportes pagados aparecerán aquí." 
          />
        )}
      </SocioFinanceCard>
    </div>
  );
};

export default Aportes;

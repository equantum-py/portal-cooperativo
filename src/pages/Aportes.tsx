import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import SocioEmptyState from '../components/socio/SocioEmptyState';

const Aportes: React.FC = () => {
  const isAtrasado = mockUser.aportesAtrasadosMeses > 0;

  return (
    <div className="socio-page">
      <SocioPageHeader 
        title="Mis Aportes" 
        subtitle="Estado actualizado de tus aportes mensuales" 
      />
      
      <SocioSectionCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Aporte Mensual</p>
            <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>
              {formatCurrency(mockUser.aporteMensual)}
            </p>
          </div>
          <div>
            {isAtrasado 
              ? <SocioStatusBadge type="danger">Atrasado ({mockUser.aportesAtrasadosMeses} meses)</SocioStatusBadge>
              : <SocioStatusBadge type="success">Al día</SocioStatusBadge>}
          </div>
        </div>
        
        <div className="socio-grid-2">
          <div className="socio-data-block">
            <p>Meses Pagados</p>
            <p>{mockUser.mesesPagadosAporte}</p>
          </div>
          <div className="socio-data-block">
            <p>Meses Pendientes</p>
            <p>{mockUser.mesesPendientesAporte}</p>
          </div>
          {isAtrasado && (
            <div className="socio-data-block" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <p>Deuda por Atraso</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '1.1rem', fontWeight: 600 }}>
                {formatCurrency(mockUser.aportesAtrasadosMonto)}
              </p>
            </div>
          )}
        </div>
        
        {isAtrasado && (
          <div className="mt-4">
            <button className="socio-cta-btn socio-cta-danger">Regularizar Aporte Online</button>
          </div>
        )}
      </SocioSectionCard>

      <SocioSectionCard title="Historial de Aportes">
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
                  date={aporte.fechaPago || 'Pendiente'}
                  amount={formatCurrency(aporte.monto)}
                  rightAddon={
                    <SocioStatusBadge type={badgeType}>
                      {aporte.estado.charAt(0).toUpperCase() + aporte.estado.slice(1)}
                    </SocioStatusBadge>
                  }
                />
              );
            })}
          </div>
        ) : (
          <SocioEmptyState 
            icon="fa-receipt" 
            title="Aún no hay movimientos" 
            subtitle="Tus aportes aparecerán aquí una vez registrados." 
          />
        )}
      </SocioSectionCard>
    </div>
  );
};

export default Aportes;

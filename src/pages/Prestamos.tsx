import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import SocioEmptyState from '../components/socio/SocioEmptyState';

const Prestamos: React.FC = () => {
  const isAtrasado = mockUser.cuotasVencidas > 0;

  return (
    <div className="socio-page">
      <SocioPageHeader 
        title="Mis Préstamos" 
        subtitle="Consultá tus cuotas y vencimientos" 
      />
      
      <SocioSectionCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Total Concedido</p>
            <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>
              {formatCurrency(mockUser.prestamoConcedido)}
            </p>
          </div>
          <div>
            {isAtrasado 
              ? <SocioStatusBadge type="danger">Vencido</SocioStatusBadge>
              : <SocioStatusBadge type="success">Al día</SocioStatusBadge>}
          </div>
        </div>
        
        <div className="socio-grid-2">
          <div className="socio-data-block">
            <p>Cuotas Pagadas</p>
            <p>{mockUser.cuotasPagadas}</p>
          </div>
          <div className="socio-data-block">
            <p>Cuotas Pendientes</p>
            <p>{mockUser.cuotasPendientes}</p>
          </div>
          {isAtrasado && (
            <div className="socio-data-block" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <p>Cuotas Vencidas</p>
              <p style={{ color: 'var(--color-danger)', fontSize: '1.1rem', fontWeight: 600 }}>
                {mockUser.cuotasVencidas} cuotas
              </p>
            </div>
          )}
        </div>
      </SocioSectionCard>

      <div style={{ margin: '0 1rem 1.5rem' }}>
        <div style={{ 
          backgroundColor: isAtrasado ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-bg)', 
          border: isAtrasado ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0,0,0,0.05)',
          padding: '1.5rem', 
          borderRadius: '20px' 
        }}>
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: isAtrasado ? 'var(--color-danger)' : 'var(--color-text)' }}>
            Próximo Vencimiento
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Monto a pagar</p>
              <p style={{ fontWeight: 600, fontSize: '1.25rem', color: isAtrasado ? 'var(--color-danger)' : 'var(--color-primary)', margin: 0 }}>
                {formatCurrency(mockUser.montoProximaCuota)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Fecha</p>
              <p style={{ fontWeight: 500, margin: 0 }}>{mockUser.fechaProximoVencimiento}</p>
            </div>
          </div>
          <button className={`socio-cta-btn ${isAtrasado ? 'socio-cta-danger' : 'socio-cta-primary'}`}>
            Pagar Cuota
          </button>
        </div>
      </div>

      <SocioSectionCard title="Historial de Cuotas">
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
                  icon="fa-hand-holding-dollar"
                  iconColor={iconColor}
                  title={`Cuota ${prestamo.cuota}`}
                  date={prestamo.vencimiento}
                  amount={formatCurrency(prestamo.monto)}
                  rightAddon={
                    <SocioStatusBadge type={badgeType}>
                      {prestamo.estado.charAt(0).toUpperCase() + prestamo.estado.slice(1)}
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
      </SocioSectionCard>
    </div>
  );
};

export default Prestamos;

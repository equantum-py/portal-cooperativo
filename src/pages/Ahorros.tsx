import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioEmptyState from '../components/socio/SocioEmptyState';

const Ahorros: React.FC = () => {
  return (
    <div className="socio-page">
      <SocioPageHeader 
        title="Mis Ahorros" 
        subtitle="Movimientos y saldo de tus cajas de ahorro" 
      />
      
      <div className="socio-balance-card" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
        <p className="socio-balance-title">Saldo Disponible</p>
        <h2 className="socio-balance-amount">{formatCurrency(mockUser.saldoDisponibleAhorro)}</h2>
        <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.8 }}>
          <i className="fa-solid fa-money-bill-wave" style={{ fontSize: '2rem' }}></i>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
          <span>Total Ahorrado histórico: {formatCurrency(mockUser.totalAhorrado)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0 1rem 1.5rem' }}>
        <button className="socio-cta-btn socio-cta-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
          <i className="fa-solid fa-arrow-down" style={{ marginRight: '0.5rem', color: 'var(--color-success)' }}></i> 
          Solicitar Retiro
        </button>
        <button className="socio-cta-btn socio-cta-secondary" style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
          <i className="fa-solid fa-building-columns" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}></i> 
          Depositar
        </button>
      </div>

      <SocioSectionCard title="Últimos Movimientos">
        {mockUser.movimientosAhorro && mockUser.movimientosAhorro.length > 0 ? (
          <div className="socio-movement-list">
            {mockUser.movimientosAhorro.map(mov => {
              const isPositive = mov.monto > 0;
              
              return (
                <SocioMovementItem 
                  key={mov.id}
                  icon={isPositive ? 'fa-arrow-down' : 'fa-arrow-up'}
                  iconColor={isPositive ? 'success' : 'danger'}
                  title={mov.concepto}
                  date={mov.fecha}
                  amount={formatCurrency(mov.monto)}
                  amountColor={isPositive ? 'success' : 'text'}
                />
              );
            })}
          </div>
        ) : (
          <SocioEmptyState 
            icon="fa-money-bill-transfer" 
            title="Sin movimientos" 
            subtitle="Tus depósitos y retiros aparecerán aquí." 
          />
        )}
      </SocioSectionCard>
    </div>
  );
};

export default Ahorros;

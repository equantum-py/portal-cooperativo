import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioHeroCard from '../components/socio/SocioHeroCard';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioEmptyState from '../components/socio/SocioEmptyState';
import { SocioActionGrid, SocioActionPill } from '../components/socio/SocioActionGrid';

const Ahorros: React.FC = () => {
  return (
    <div className="socio-app-page">
      <SocioPageHeader 
        title="Mis Ahorros" 
        subtitle="Movimientos y saldo de tus cajas de ahorro" 
      />
      
      <SocioHeroCard 
        label="Saldo Disponible"
        value={formatCurrency(mockUser.saldoDisponibleAhorro)}
        gradient="success"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingBottom: '0.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Cuenta Ahorro a la Vista</p>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>***{mockUser.numeroSocio}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Total Histórico</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(mockUser.totalAhorrado)}</p>
          </div>
        </div>
      </SocioHeroCard>

      <SocioActionGrid>
        <SocioActionPill primary icon="fa-arrow-down" label="Solicitar Retiro" onClick={() => alert('Retiro')} />
        <SocioActionPill icon="fa-building-columns" label="Depositar" onClick={() => alert('Depósito')} />
      </SocioActionGrid>

      <div style={{ padding: '0 1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', marginTop: '1rem' }}>
          Últimos Movimientos
        </h3>
      </div>

      <SocioFinanceCard>
        {mockUser.movimientosAhorro && mockUser.movimientosAhorro.length > 0 ? (
          <div className="socio-movement-list">
            {mockUser.movimientosAhorro.map(mov => {
              const isPositive = mov.monto > 0;
              
              return (
                <SocioMovementItem 
                  key={mov.id}
                  icon={isPositive ? 'fa-arrow-down' : 'fa-arrow-up'}
                  iconColor={isPositive ? 'success' : 'primary'}
                  title={mov.concepto}
                  date={mov.fecha}
                  amount={(isPositive ? '+' : '') + formatCurrency(mov.monto)}
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
      </SocioFinanceCard>
    </div>
  );
};

export default Ahorros;

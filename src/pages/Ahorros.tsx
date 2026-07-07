import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import StatCard from '../components/StatCard';

const Ahorros: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Mis Ahorros</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Total Ahorrado" 
          value={formatCurrency(mockUser.totalAhorrado)} 
          icon="fa-piggy-bank" 
          color="secondary" 
        />
        <StatCard 
          title="Saldo Disponible" 
          value={formatCurrency(mockUser.saldoDisponibleAhorro)} 
          icon="fa-money-bill-wave" 
          color="success" 
        />
      </div>

      <div className="card">
        <h2 className="title-md mb-3">Últimos Movimientos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Fecha</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Concepto</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {mockUser.movimientosAhorro.map(mov => (
                <tr key={mov.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{mov.fecha}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{mov.concepto}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)', color: mov.monto > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {formatCurrency(mov.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ahorros;

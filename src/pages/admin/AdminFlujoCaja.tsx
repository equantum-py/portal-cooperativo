import React from 'react';
import { mockFlujoCajaMensual, formatCurrency, mockAdminStats } from '../../data/mockData';
import StatCard from '../../components/StatCard';

const AdminFlujoCaja: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Flujo de Caja</h1>
        <p className="text-muted">Resumen mensual de ingresos, egresos y saldos de la cooperativa.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Ingresos (Mes Actual)" value={formatCurrency(mockAdminStats.ingresosMesActual)} icon="fa-arrow-trend-up" color="success" />
        <StatCard title="Egresos (Mes Actual)" value={formatCurrency(mockAdminStats.egresosMesActual)} icon="fa-arrow-trend-down" color="danger" />
        <StatCard title="Saldo Disponible (Caja)" value={formatCurrency(mockAdminStats.saldoCajaEstimado)} icon="fa-vault" color="primary" />
        <StatCard title="Pendiente de Cobro" value={formatCurrency(mockAdminStats.totalPendienteCobro)} icon="fa-file-invoice-dollar" color="warning" />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h2 className="title-md" style={{ padding: '1.5rem 1.5rem 0', marginBottom: '1rem' }}>Consolidado Mensual (Histórico)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Mes</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Ingresos Aportes</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Ingresos Préstamos</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Otros Ingresos</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Total Egresos</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Saldo Final Neto</th>
              </tr>
            </thead>
            <tbody>
              {mockFlujoCajaMensual.map((mesData, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{mesData.mes}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-success)' }}>{formatCurrency(mesData.ingresosAportes)}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-success)' }}>{formatCurrency(mesData.ingresosPrestamos)}</td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(mesData.otrosIngresos)}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-danger)' }}>{formatCurrency(mesData.egresos)}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatCurrency(mesData.saldoNeto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFlujoCaja;

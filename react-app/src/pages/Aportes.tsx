import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import Badge from '../components/Badge';

const Aportes: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Tus Aportes</h1>
      
      <div className="card mb-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="title-md" style={{ marginBottom: 0 }}>Estado de Aportes</h2>
          </div>
          <div>
            {mockUser.aportesAtrasadosMeses > 0 
              ? <Badge type="danger">Atrasado ({mockUser.aportesAtrasadosMeses} meses)</Badge>
              : <Badge type="success">Al día</Badge>}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p className="text-muted mb-1">Aporte Mensual</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{formatCurrency(mockUser.aporteMensual)}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Meses Pagados</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{mockUser.mesesPagadosAporte}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Meses Pendientes</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{mockUser.mesesPendientesAporte}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Deuda por Atraso</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem', color: mockUser.aportesAtrasadosMonto > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
              {formatCurrency(mockUser.aportesAtrasadosMonto)}
            </p>
          </div>
        </div>
        
        {mockUser.aportesAtrasadosMeses > 0 && (
          <div className="mt-4">
            <button className="btn btn-primary">Regularizar Aporte Online</button>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="title-md mb-3">Historial de Aportes</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Mes</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Monto</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Fecha de Pago</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockUser.historialAportes.map(aporte => (
                <tr key={aporte.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{aporte.mes}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{formatCurrency(aporte.monto)}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{aporte.fechaPago || '-'}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>
                    {aporte.estado === 'pagado' && <Badge type="success">Pagado</Badge>}
                    {aporte.estado === 'pendiente' && <Badge type="warning">Pendiente</Badge>}
                    {aporte.estado === 'atrasado' && <Badge type="danger">Atrasado</Badge>}
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

export default Aportes;

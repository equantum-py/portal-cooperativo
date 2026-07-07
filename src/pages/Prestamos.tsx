import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';
import Badge from '../components/Badge';

const Prestamos: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Mis Préstamos</h1>
      
      <div className="card mb-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="title-md" style={{ marginBottom: 0 }}>Préstamo Vigente</h2>
          </div>
          <div>
            {mockUser.cuotasVencidas > 0
              ? <Badge type="danger">Atrasado</Badge>
              : <Badge type="success">Al día</Badge>}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p className="text-muted mb-1">Total Concedido</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{formatCurrency(mockUser.prestamoConcedido)}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Cuotas Pagadas</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{mockUser.cuotasPagadas}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Cuotas Pendientes</p>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{mockUser.cuotasPendientes}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Cuotas Vencidas</p>
            <p style={{ fontWeight: mockUser.cuotasVencidas > 0 ? 'bold' : 500, fontSize: '1.1rem', color: mockUser.cuotasVencidas > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
              {mockUser.cuotasVencidas}
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Próxima Cuota</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p className="text-muted mb-1">Monto a pagar</p>
              <p style={{ fontWeight: 500, fontSize: '1.25rem', color: 'var(--color-primary)' }}>{formatCurrency(mockUser.montoProximaCuota)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-muted mb-1">Vencimiento</p>
              <p style={{ fontWeight: 500 }}>{mockUser.fechaProximoVencimiento}</p>
            </div>
          </div>
          <button className="btn btn-secondary mt-3">Pagar Cuota</button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-md mb-3">Historial de Pagos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Cuota</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Vencimiento</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Monto</th>
                <th style={{ padding: '10px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-light)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockUser.historialPrestamos.map(prestamo => (
                <tr key={prestamo.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>Cuota {prestamo.cuota}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{prestamo.vencimiento}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>{formatCurrency(prestamo.monto)}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--color-border)' }}>
                    {prestamo.estado === 'pagado' && <Badge type="success">Pagado</Badge>}
                    {prestamo.estado === 'pendiente' && <Badge type="warning">Pendiente</Badge>}
                    {prestamo.estado === 'vencido' && <Badge type="danger">Vencido</Badge>}
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

export default Prestamos;

import React from 'react';
import { mockUser, formatCurrency } from '../data/mockData';

const Pagos: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Pagos Pendientes</h1>
      
      <div className="card text-center" style={{ padding: '3rem 1rem' }}>
        <h2 className="title-md text-muted mb-2">Total a Pagar</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>
          {formatCurrency(mockUser.pagoPendiente)}
        </div>
        <p className="text-muted mb-3">Vencimiento: <strong>{mockUser.fechaProximoVencimiento}</strong></p>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <button className="btn btn-primary mb-2">Pagar Todo Online</button>
          <button className="btn btn-outline">Descargar Extracto (PDF)</button>
        </div>
      </div>
    </div>
  );
};

export default Pagos;

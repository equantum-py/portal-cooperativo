import React from 'react';
import { mockUser } from '../data/mockData';

const Express: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Préstamo Express</h1>
      
      {mockUser.calificaPrestamoExpress ? (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '4rem', color: 'var(--color-success)', marginBottom: '1rem' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h2 className="title-md">¡Calificás para Préstamo Express!</h2>
          <p className="text-muted mb-3">Tus aportes están al día y tenés buen historial de pago.</p>
          <button className="btn btn-secondary" onClick={() => alert('Funcionalidad de solicitud de préstamo en desarrollo.')}>
            Solicitar Préstamo Express
          </button>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '4rem', color: 'var(--color-warning)', marginBottom: '1rem' }}>
            <i className="fa-solid fa-clock"></i>
          </div>
          <h2 className="title-md">En Revisión</h2>
          <p className="text-muted mb-3">Actualmente no calificás para el Préstamo Express. Regularizá tus aportes para acceder a este beneficio.</p>
        </div>
      )}
      
      <div className="card mt-3">
        <h3 className="title-md">Requisitos para calificar:</h3>
        <ul style={{ listStylePosition: 'inside', paddingLeft: '1rem', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
          <li>Tener los aportes al día (sin meses de atraso).</li>
          <li>No tener cuotas de préstamos vencidas.</li>
          <li>Antigüedad mínima de 6 meses como socio.</li>
          <li>Buen historial de pago en la cooperativa.</li>
        </ul>
      </div>
    </div>
  );
};

export default Express;

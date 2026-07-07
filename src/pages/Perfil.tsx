import React from 'react';
import { mockUser } from '../data/mockData';
import Badge from '../components/Badge';

const Perfil: React.FC = () => {
  return (
    <div>
      <h1 className="title-lg mb-3">Mi Perfil</h1>
      
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
          <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginRight: '1.5rem' }}>
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <h2 className="title-md" style={{ marginBottom: '0.25rem' }}>{mockUser.nombre}</h2>
            <div><Badge type="success">{mockUser.estadoSocio}</Badge></div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p className="text-muted mb-1">Cédula de Identidad</p>
            <p style={{ fontWeight: 500 }}>{mockUser.cedula}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Número de Socio</p>
            <p style={{ fontWeight: 500 }}>{mockUser.numeroSocio}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Teléfono</p>
            <p style={{ fontWeight: 500 }}>{mockUser.telefono}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Correo Electrónico</p>
            <p style={{ fontWeight: 500 }}>{mockUser.email}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Dirección</p>
            <p style={{ fontWeight: 500 }}>{mockUser.direccion}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Fecha de Ingreso</p>
            <p style={{ fontWeight: 500 }}>{mockUser.fechaIngreso}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <button className="btn btn-outline" style={{ maxWidth: 250 }} onClick={() => alert('Funcionalidad de actualización en desarrollo')}>
            Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

import React from 'react';
import { mockUser } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioSectionCard from '../components/socio/SocioSectionCard';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';

const Perfil: React.FC = () => {
  const firstName = mockUser.nombre.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="socio-page">
      <SocioPageHeader title="Mi Perfil" />
      
      <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
        <div style={{ 
          width: 80, height: 80, backgroundColor: 'var(--color-primary)', color: 'white', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', margin: '0 auto 1rem', boxShadow: '0 4px 15px rgba(10,32,83,0.15)' 
        }}>
          {initial}
        </div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>{mockUser.nombre}</h2>
        <SocioStatusBadge type="success">{mockUser.estadoSocio.toUpperCase()}</SocioStatusBadge>
      </div>
      
      <SocioSectionCard title="Datos Personales">
        <div className="socio-grid-2">
          <div className="socio-data-block">
            <p>Cédula de Identidad</p>
            <p>{mockUser.cedula}</p>
          </div>
          <div className="socio-data-block">
            <p>Teléfono</p>
            <p>{mockUser.telefono}</p>
          </div>
          <div className="socio-data-block" style={{ gridColumn: '1 / -1' }}>
            <p>Correo Electrónico</p>
            <p>{mockUser.email}</p>
          </div>
          <div className="socio-data-block" style={{ gridColumn: '1 / -1' }}>
            <p>Dirección</p>
            <p>{mockUser.direccion}</p>
          </div>
        </div>
      </SocioSectionCard>

      <SocioSectionCard title="Datos de Socio">
        <div className="socio-grid-2">
          <div className="socio-data-block">
            <p>Número de Socio</p>
            <p>{mockUser.numeroSocio}</p>
          </div>
          <div className="socio-data-block">
            <p>Fecha de Ingreso</p>
            <p>{mockUser.fechaIngreso}</p>
          </div>
        </div>
      </SocioSectionCard>

      <SocioSectionCard title="Seguridad y Acceso">
        <div className="socio-movement-list">
          <button className="socio-movement-item" style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => alert('En desarrollo')}>
            <div className="socio-movement-icon" style={{ backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--color-text)' }}>
              <i className="fa-solid fa-pen"></i>
            </div>
            <div className="socio-movement-content">
              <p className="socio-movement-title">Actualizar datos personales</p>
            </div>
            <i className="fa-solid fa-chevron-right text-muted"></i>
          </button>
          
          <button className="socio-movement-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => alert('En desarrollo')}>
            <div className="socio-movement-icon" style={{ backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--color-text)' }}>
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className="socio-movement-content">
              <p className="socio-movement-title">Contactar administración</p>
            </div>
            <i className="fa-solid fa-chevron-right text-muted"></i>
          </button>
        </div>
      </SocioSectionCard>
    </div>
  );
};

export default Perfil;

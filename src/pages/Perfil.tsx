import React from 'react';
import { mockUser } from '../data/mockData';
import SocioPageHeader from '../components/socio/SocioPageHeader';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import SocioInfoRow from '../components/socio/SocioInfoRow';

const Perfil: React.FC = () => {
  const firstName = mockUser.nombre.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="socio-app-page">
      <div style={{ 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)', 
        paddingBottom: '3rem',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        marginBottom: '-2rem'
      }}>
        <SocioPageHeader title="Perfil" dark />
        <div style={{ textAlign: 'center', padding: '0 1.5rem 1rem' }}>
          <div style={{ 
            width: 88, height: 88, backgroundColor: 'var(--color-white)', color: 'var(--color-primary)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '2.5rem', fontWeight: 800, margin: '0 auto 1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            border: '4px solid rgba(255,255,255,0.2)'
          }}>
            {initial}
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{mockUser.nombre}</h2>
          <SocioStatusBadge type="success">SOCIO {mockUser.estadoSocio.toUpperCase()}</SocioStatusBadge>
        </div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <SocioFinanceCard title="Datos Personales">
          <SocioInfoRow label="Cédula" value={mockUser.cedula} />
          <SocioInfoRow label="Teléfono" value={mockUser.telefono} />
          <SocioInfoRow label="Correo Electrónico" value={<span style={{ fontSize: '0.85rem' }}>{mockUser.email}</span>} />
          <SocioInfoRow label="Dirección" value={<span style={{ fontSize: '0.85rem' }}>{mockUser.direccion}</span>} />
        </SocioFinanceCard>

        <SocioFinanceCard title="Datos Cooperativos">
          <SocioInfoRow label="Número de Socio" value={`#${mockUser.numeroSocio}`} />
          <SocioInfoRow label="Fecha de Ingreso" value={mockUser.fechaIngreso} />
        </SocioFinanceCard>

        <SocioFinanceCard title="Seguridad y Contacto">
          <div className="socio-movement-list">
            <button className="socio-movement-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }} onClick={() => alert('En desarrollo')}>
              <div className="socio-movement-icon-wrapper" style={{ backgroundColor: '#E0F2FE', color: 'var(--color-info)' }}>
                <i className="fa-solid fa-user-pen"></i>
              </div>
              <div className="socio-movement-body">
                <p className="socio-movement-title">Actualizar Datos</p>
                <p className="socio-movement-desc">Modificar celular o correo</p>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </button>
            
            <button className="socio-movement-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '1rem 0' }} onClick={() => alert('En desarrollo')}>
              <div className="socio-movement-icon-wrapper" style={{ backgroundColor: '#D1FADF', color: 'var(--color-success)' }}>
                <i className="fa-solid fa-headset"></i>
              </div>
              <div className="socio-movement-body">
                <p className="socio-movement-title">Centro de Ayuda</p>
                <p className="socio-movement-desc">Contactar con soporte</p>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </button>
          </div>
        </SocioFinanceCard>
      </div>
    </div>
  );
};

export default Perfil;

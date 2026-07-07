import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { appConfig } from '../config/appConfig';

const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const session = authService.getSession();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await authService.logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', zIndex: 95
          }}
        ></div>
      )}

      {/* Sidebar - Ahora con estilo Clay (sombras en vez de borde) */}
      <aside 
        style={{
          width: '260px', backgroundColor: 'var(--color-white)',
          boxShadow: '4px 0 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: window.innerWidth <= 768 && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          borderRight: 'none'
        }}
      >
        <div style={{ padding: '2rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon" style={{ width: 44, height: 44, margin: 0, fontSize: '1.2rem', borderRadius: '14px', boxShadow: 'var(--clay-shadow-btn-secondary)' }}>
              <i className="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <h2 className="title-md" style={{ margin: 0, fontSize: '1.1rem' }}>{appConfig.nombreInstitucion}</h2>
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>{session?.nombre || 'Usuario'}</p>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          <MenuLink to="/dashboard" icon="fa-house" label="Inicio" onClick={closeSidebar} />
          <MenuLink to="/dashboard/aportes" icon="fa-piggy-bank" label="Aportes" onClick={closeSidebar} />
          <MenuLink to="/dashboard/prestamos" icon="fa-hand-holding-dollar" label="Préstamos" onClick={closeSidebar} />
          <MenuLink to="/dashboard/ahorros" icon="fa-vault" label="Ahorros" onClick={closeSidebar} />
          <MenuLink to="/dashboard/pagos" icon="fa-file-invoice-dollar" label="Pagos Pendientes" onClick={closeSidebar} />
          <MenuLink to="/dashboard/express" icon="fa-bolt" label="Préstamo Express" onClick={closeSidebar} />
          <MenuLink to="/dashboard/perfil" icon="fa-user" label="Perfil" onClick={closeSidebar} />
          <MenuLink to="/dashboard/notificaciones" icon="fa-bell" label="Notificaciones" onClick={closeSidebar} />
          
          {session?.rol === 'admin' && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
              <p style={{ padding: '0 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Administración</p>
              <MenuLink to="/dashboard/admin" icon="fa-screwdriver-wrench" label="Panel Admin" onClick={closeSidebar} />
            </div>
          )}
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
          <a href="#" onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', padding: '0.85rem 1.5rem', color: 'var(--color-danger)', fontWeight: 500, textDecoration: 'none',
            borderRadius: '14px', margin: '0 0.5rem', transition: 'background 0.2s'
          }}>
            <i className="fa-solid fa-right-from-bracket" style={{ width: 20, marginRight: '1rem', textAlign: 'center' }}></i>
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: window.innerWidth > 768 ? '260px' : '0', 
        padding: window.innerWidth > 768 ? '2.5rem' : '1rem',
        paddingTop: window.innerWidth > 768 ? '2.5rem' : '5rem',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%'
      }}>
        
        {/* Mobile Topbar - Ajustado a estilo clay */}
        <div style={{ 
          display: window.innerWidth <= 768 ? 'flex' : 'none', 
          alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--color-white)', padding: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px' }}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <h2 className="title-md" style={{ margin: 0, fontSize: '1.1rem' }}>{appConfig.nombreInstitucion}</h2>
          <div style={{ width: 40 }}></div>
        </div>

        {/* Dynamic Route Content */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>

      </main>
    </div>
  );
};

const MenuLink = ({ to, icon, label, onClick }: { to: string, icon: string, label: string, onClick: () => void }) => {
  return (
    <div style={{ padding: '0.2rem 1rem' }}>
      <NavLink 
        to={to} 
        end={to === "/dashboard"}
        onClick={onClick}
        style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', padding: '0.85rem 1rem', 
          color: isActive ? 'var(--color-primary)' : 'var(--color-text)', 
          backgroundColor: isActive ? 'var(--color-bg)' : 'transparent',
          borderRadius: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          boxShadow: isActive ? 'inset 2px 2px 5px rgba(0,0,0,0.02), inset -2px -2px 5px rgba(255,255,255,1)' : 'none',
          transition: 'all 0.2s'
        })}
      >
        {({ isActive }) => (
          <>
            <i className={`fa-solid ${icon}`} style={{ width: 22, marginRight: '1rem', textAlign: 'center', color: isActive ? 'var(--color-secondary)' : 'var(--color-text-light)' }}></i>
            <span>{label}</span>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default PrivateLayout;

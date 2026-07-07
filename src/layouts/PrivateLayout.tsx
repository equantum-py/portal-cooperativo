import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { demoStore } from '../services/demoStore';
import MobileBottomNav from '../components/socio/MobileBottomNav';

const PrivateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const session = authService.getSession();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const wasAdmin = session?.rol === 'admin';
    await authService.logout();
    navigate(wasAdmin ? '/admin' : '/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const isAdmin = session?.rol === 'admin';
  const config = demoStore.getConfiguracion();
  const headerName = isAdmin ? config.nombreAdmin : (session?.nombre || 'Juan Pérez');

  return (
    <div className={!isAdmin ? "socio-mobile-shell" : ""} style={{ display: 'flex', minHeight: '100dvh' }}>
      
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

      {/* Sidebar - Estilo Clay */}
      <aside 
        className={!isAdmin ? "socio-sidebar desktop-only" : ""}
        style={{
          width: '260px', backgroundColor: 'var(--color-white)',
          boxShadow: '4px 0 15px rgba(0,0,0,0.03)', display: !isAdmin ? 'none' : 'flex', flexDirection: 'column',
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
              <h2 className="title-md" style={{ margin: 0, fontSize: '1.1rem' }}>{config.nombrePortal}</h2>
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0, fontWeight: isAdmin ? 600 : 400, color: isAdmin ? 'var(--color-primary)' : '' }}>{headerName}</p>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {!isAdmin ? (
            // MENÚ SOCIO
            <>
              <MenuLink to="/dashboard" icon="fa-house" label="Inicio" onClick={closeSidebar} />
              <MenuLink to="/dashboard/aportes" icon="fa-piggy-bank" label="Aportes" onClick={closeSidebar} />
              <MenuLink to="/dashboard/prestamos" icon="fa-hand-holding-dollar" label="Préstamos" onClick={closeSidebar} />
              <MenuLink to="/dashboard/ahorros" icon="fa-vault" label="Ahorros" onClick={closeSidebar} />
              <MenuLink to="/dashboard/pagos" icon="fa-file-invoice-dollar" label="Pagos Pendientes" onClick={closeSidebar} />
              <MenuLink to="/dashboard/express" icon="fa-bolt" label="Préstamo Express" onClick={closeSidebar} />
              <MenuLink to="/dashboard/perfil" icon="fa-user" label="Perfil" onClick={closeSidebar} />
              <MenuLink to="/dashboard/notificaciones" icon="fa-bell" label="Notificaciones" onClick={closeSidebar} />
            </>
          ) : (
            // MENÚ ADMINISTRADOR
            <>
              <MenuLink to="/dashboard/admin" icon="fa-chart-line" label="Panel de Control" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/socios" icon="fa-users" label="Socios" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/aportes" icon="fa-piggy-bank" label="Aportes Mensuales" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/prestamos" icon="fa-hand-holding-dollar" label="Préstamos" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/cuotas-vencidas" icon="fa-calendar-xmark" label="Cuotas Vencidas" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/pagos" icon="fa-file-invoice-dollar" label="Pagos" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/flujo-caja" icon="fa-money-bill-trend-up" label="Flujo de Caja" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/ahorros" icon="fa-vault" label="Ahorros" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/solicitudes" icon="fa-clipboard-list" label="Solicitudes" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/notificaciones" icon="fa-bullhorn" label="Notificaciones" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/reportes" icon="fa-file-pdf" label="Reportes" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/importar-exportar" icon="fa-file-excel" label="Importar / Exportar" onClick={closeSidebar} />
              <MenuLink to="/dashboard/admin/configuracion" icon="fa-gear" label="Configuración" onClick={closeSidebar} />
            </>
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
        padding: window.innerWidth > 768 ? '2.5rem' : (!isAdmin ? '0' : '1rem'),
        paddingTop: window.innerWidth > 768 ? '2.5rem' : (!isAdmin ? '0' : '5rem'),
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        overflowX: 'hidden'
      }}>
        
        {/* Mobile Topbar - Estilo clay */}
        <div className={!isAdmin ? "desktop-only" : ""} style={{ 
          display: window.innerWidth <= 768 ? 'flex' : 'none', 
          alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--color-white)', padding: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px' }}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <h2 className="title-md" style={{ margin: 0, fontSize: '1.1rem' }}>{config.nombrePortal}</h2>
          <div style={{ width: 40 }}></div>
        </div>

        {/* Dynamic Route Content */}
        <div style={!isAdmin ? { width: '100%', maxWidth: '600px', margin: '0 auto' } : { maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
        
        {!isAdmin && (
          <div className="mobile-only">
            <MobileBottomNav />
          </div>
        )}

      </main>
    </div>
  );
};

const MenuLink = ({ to, icon, label, onClick }: { to: string, icon: string, label: string, onClick: () => void }) => {
  return (
    <div style={{ padding: '0.2rem 1rem' }}>
      <NavLink 
        to={to} 
        end={to === "/dashboard" || to === "/dashboard/admin"}
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

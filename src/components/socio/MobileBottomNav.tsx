import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav: React.FC = () => {
  return (
    <nav className="socio-bottom-nav">
      <NavItem to="/dashboard" icon="fa-house" label="Inicio" />
      <NavItem to="/dashboard/aportes" icon="fa-piggy-bank" label="Aportes" />
      <NavItem to="/dashboard/prestamos" icon="fa-hand-holding-dollar" label="Préstamos" />
      <NavItem to="/dashboard/notificaciones" icon="fa-bell" label="Notif." />
      <NavItem to="/dashboard/perfil" icon="fa-user" label="Perfil" />
    </nav>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: string, label: string }) => {
  return (
    <NavLink 
      to={to} 
      end={to === "/dashboard"}
      className={({ isActive }) => `socio-bottom-nav-item ${isActive ? 'active' : ''}`}
    >
      <i className={`fa-solid ${icon}`}></i>
      <span>{label}</span>
    </NavLink>
  );
};

export default MobileBottomNav;

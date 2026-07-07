import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
    <div className="socio-quick-actions">
      <ActionBtn to="/dashboard/aportes" icon="fa-piggy-bank" label="Aportes" />
      <ActionBtn to="/dashboard/prestamos" icon="fa-hand-holding-dollar" label="Préstamos" />
      <ActionBtn to="/dashboard/ahorros" icon="fa-vault" label="Ahorros" />
      <ActionBtn to="/dashboard/pagos" icon="fa-file-invoice-dollar" label="Pagos" />
      <ActionBtn to="/dashboard/express" icon="fa-bolt" label="Express" />
      <ActionBtn to="/dashboard/notificaciones" icon="fa-bell" label="Alertas" />
    </div>
  );
};

const ActionBtn = ({ to, icon, label }: { to: string, icon: string, label: string }) => {
  return (
    <Link to={to} className="socio-qa-btn">
      <div className="socio-qa-icon-wrapper">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <span className="socio-qa-label">{label}</span>
    </Link>
  );
};

export default QuickActions;

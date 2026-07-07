import React from 'react';

interface SocioMovementItemProps {
  icon: string;
  iconColor?: 'primary' | 'success' | 'danger' | 'warning';
  title: string;
  date: string;
  amount: string;
  amountColor?: 'text' | 'success' | 'danger';
  status?: React.ReactNode;
}

const SocioMovementItem: React.FC<SocioMovementItemProps> = ({ 
  icon, 
  iconColor = 'primary', 
  title, 
  date, 
  amount, 
  amountColor = 'text',
  status 
}) => {

  const bgColors = {
    primary: 'rgba(37, 99, 235, 0.1)',
    success: 'rgba(16, 185, 129, 0.1)',
    danger: 'rgba(239, 68, 68, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)'
  };
  
  const textColors = {
    primary: '#2563eb',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  };

  const amountColorVar = amountColor === 'text' ? '#0f172a' : (amountColor === 'success' ? '#10b981' : '#ef4444');

  return (
    <div className="socio-movement-item">
      <div 
        className="socio-movement-icon-wrapper" 
        style={{ backgroundColor: bgColors[iconColor], color: textColors[iconColor] }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="socio-movement-body">
        <p className="socio-movement-title">{title}</p>
        <p className="socio-movement-desc">{date}</p>
      </div>
      <div className="socio-movement-right">
        <p className="socio-movement-amount" style={{ color: amountColorVar }}>
          {amount}
        </p>
        {status && <div>{status}</div>}
      </div>
    </div>
  );
};

export default SocioMovementItem;

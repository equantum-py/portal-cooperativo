import React from 'react';

interface SocioMovementItemProps {
  icon: string;
  iconColor?: 'primary' | 'success' | 'danger' | 'warning';
  title: string;
  date: string;
  amount: string;
  amountColor?: 'text' | 'success' | 'danger';
  rightAddon?: React.ReactNode;
}

const SocioMovementItem: React.FC<SocioMovementItemProps> = ({ 
  icon, 
  iconColor = 'primary', 
  title, 
  date, 
  amount, 
  amountColor = 'text',
  rightAddon 
}) => {

  const bgColors = {
    primary: 'rgba(3, 170, 229, 0.1)',
    success: 'rgba(16, 185, 129, 0.1)',
    danger: 'rgba(239, 68, 68, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)'
  };
  
  const textColors = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)'
  };

  const amountColorVar = amountColor === 'text' ? 'var(--color-text)' : `var(--color-${amountColor})`;

  return (
    <div className="socio-movement-item">
      <div 
        className="socio-movement-icon" 
        style={{ 
          backgroundColor: bgColors[iconColor], 
          color: textColors[iconColor] 
        }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="socio-movement-content">
        <p className="socio-movement-title">{title}</p>
        <p className="socio-movement-date">{date}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p className="socio-movement-amount" style={{ color: amountColorVar }}>
          {amount}
        </p>
        {rightAddon && <div style={{ marginTop: '0.25rem' }}>{rightAddon}</div>}
      </div>
    </div>
  );
};

export default SocioMovementItem;

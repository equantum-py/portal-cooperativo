import React from 'react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

const colorMap = {
  primary: { bg: '#e0e7ff', text: 'var(--color-primary)' },
  secondary: { bg: '#f0f7fb', text: 'var(--color-secondary)' },
  success: { bg: '#d1fae5', text: 'var(--color-success)' },
  warning: { bg: '#fef3c7', text: 'var(--color-warning)' },
  danger: { bg: '#fee2e2', text: 'var(--color-danger)' },
  info: { bg: '#dbeafe', text: 'var(--color-info)' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'secondary' }) => {
  const theme = colorMap[color];
  
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', padding: '1.5rem', 
      borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-white)', 
      boxShadow: 'var(--clay-shadow-light)'
    }}>
      <div style={{ 
        width: 52, height: 52, borderRadius: '20px', 
        backgroundColor: theme.bg, color: theme.text, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '1.5rem', marginRight: '1rem',
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.05)'
      }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.25rem', fontWeight: 500 }}>{title}</h3>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;

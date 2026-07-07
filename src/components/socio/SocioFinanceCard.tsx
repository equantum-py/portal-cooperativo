import React from 'react';

interface SocioFinanceCardProps {
  title?: string;
  children: React.ReactNode;
}

const SocioFinanceCard: React.FC<SocioFinanceCardProps> = ({ title, children }) => {
  return (
    <div className="socio-finance-card">
      {title && <h2 className="socio-finance-card-title">{title}</h2>}
      {children}
    </div>
  );
};

export default SocioFinanceCard;

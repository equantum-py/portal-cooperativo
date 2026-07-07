import React from 'react';

interface SocioInfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

const SocioInfoRow: React.FC<SocioInfoRowProps> = ({ label, value }) => {
  return (
    <div className="socio-info-row">
      <p className="socio-info-label">{label}</p>
      <div className="socio-info-value">{value}</div>
    </div>
  );
};

export default SocioInfoRow;

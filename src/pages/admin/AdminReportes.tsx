import React from 'react';

const ReportButton = ({ title, icon }: { title: string, icon: string }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: 'var(--clay-shadow-card)' }} 
       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
       onClick={() => alert('Funcionalidad preparada para descarga en próxima fase. Se generará un archivo PDF/Excel.')}>
    <i className={`fa-solid ${icon}`} style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}></i>
    <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-primary)' }}>{title}</h3>
  </div>
);

const AdminReportes: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Reportes Financieros</h1>
        <p className="text-muted">Generá y descargá listados e informes de estado de la cooperativa.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <ReportButton title="Lista de Socios (Completo)" icon="fa-users-viewfinder" />
        <ReportButton title="Aportes del Mes" icon="fa-file-invoice" />
        <ReportButton title="Socios Atrasados" icon="fa-user-clock" />
        <ReportButton title="Préstamos Activos" icon="fa-file-contract" />
        <ReportButton title="Cuotas Vencidas" icon="fa-triangle-exclamation" />
        <ReportButton title="Flujo de Caja (Histórico)" icon="fa-chart-pie" />
        <ReportButton title="Informe General PDF" icon="fa-file-pdf" />
      </div>
    </div>
  );
};

export default AdminReportes;

import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../data/mockData';
import StatCard from '../components/StatCard';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-4">Cargando panel de control...</div>;
  if (!stats) return <div className="text-center mt-4 text-danger">Error al cargar estadísticas.</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Panel de Control</h1>
        <p className="text-muted">Vista general de la cooperativa.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total de Socios" value={stats.totalSocios} icon="fa-users" color="primary" />
        <StatCard title="Socios Activos" value={stats.sociosActivos} icon="fa-user-check" color="success" />
        <StatCard title="Socios Atrasados" value={stats.sociosAtrasados} icon="fa-user-clock" color="warning" />
        <StatCard title="Préstamos Activos" value={stats.prestamosActivos} icon="fa-handshake" color="info" />
      </div>

      <div className="card">
        <h2 className="title-md mb-3">Resumen Financiero (Alerta)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p className="text-muted mb-1">Pagos Pendientes Totales</p>
            <p style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--color-primary)' }}>{formatCurrency(stats.pagosPendientesTotal)}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Cuotas Vencidas (Global)</p>
            <p style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--color-danger)' }}>{stats.cuotasVencidasTotal}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="btn btn-primary" style={{ maxWidth: '250px' }} onClick={() => alert("Módulo en desarrollo")}>
          Gestionar Socios
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;

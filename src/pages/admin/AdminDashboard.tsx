import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import { formatCurrency } from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>Cargando resumen financiero...</div>;
  }

  if (!stats) return <div>Error cargando datos administrativos.</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Panel de Control Financiero</h1>
        <p className="text-muted">Resumen global del estado de la cooperativa.</p>
      </div>
      
      <h2 className="title-md" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Métricas de Socios</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total de Socios" value={stats.totalSocios} icon="fa-users" color="primary" />
        <StatCard title="Socios Activos" value={stats.sociosActivos} icon="fa-user-check" color="success" />
        <StatCard title="Socios Atrasados" value={stats.sociosAtrasados} icon="fa-user-clock" color="warning" />
      </div>

      <h2 className="title-md" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Aportes y Préstamos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Aportes Cobrados (Mes)" value={formatCurrency(stats.aportesCobradosMes)} icon="fa-piggy-bank" color="success" />
        <StatCard title="Aportes Pendientes (Mes)" value={formatCurrency(stats.aportesPendientesMes)} icon="fa-triangle-exclamation" color="warning" />
        <StatCard title="Préstamos Activos" value={stats.prestamosActivos} icon="fa-hand-holding-dollar" color="secondary" />
        <StatCard title="Cuotas Vencidas (Global)" value={stats.cuotasVencidasTotal} icon="fa-calendar-xmark" color="danger" />
      </div>

      <h2 className="title-md" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Flujo de Caja y Ahorros</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Ingresos del Mes" value={formatCurrency(stats.ingresosMesActual)} icon="fa-arrow-trend-up" color="success" />
        <StatCard title="Egresos del Mes" value={formatCurrency(stats.egresosMesActual)} icon="fa-arrow-trend-down" color="danger" />
        <StatCard title="Saldo en Caja (Estimado)" value={formatCurrency(stats.saldoCajaEstimado)} icon="fa-vault" color="primary" />
        <StatCard title="Total Ahorrado (Socios)" value={formatCurrency(stats.totalAhorradoSocios)} icon="fa-sack-dollar" color="secondary" />
        <StatCard title="Total Pendiente de Cobro" value={formatCurrency(stats.totalPendienteCobro)} icon="fa-file-invoice-dollar" color="warning" />
      </div>
    </div>
  );
};

export default AdminDashboard;

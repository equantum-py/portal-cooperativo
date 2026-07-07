import React, { useEffect, useState } from 'react';
import { formatCurrency, Socio } from '../data/mockData';
import { memberService } from '../services/memberService';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await memberService.getProfile();
        setData(profile);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>Cargando información...</div>;
  }

  if (!data) return <div>Error cargando datos.</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Hola, {data.nombre.split(' ')[0]}</h1>
        <p className="text-muted">Este es el resumen de tu estado como socio.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Total Ahorrado" 
          value={formatCurrency(data.totalAhorrado)} 
          icon="fa-vault" 
          color="secondary" 
        />
        <StatCard 
          title="Pagos Pendientes" 
          value={formatCurrency(data.pagoPendiente)} 
          icon="fa-file-invoice-dollar" 
          color="danger" 
        />
        <StatCard 
          title="Aportes Atrasados" 
          value={data.aportesAtrasadosMeses > 0 ? `${data.aportesAtrasadosMeses} meses` : 'Al día'} 
          icon="fa-clock-rotate-left" 
          color="warning" 
        />
        <StatCard 
          title="Cuotas Vencidas" 
          value={data.cuotasVencidas > 0 ? `${data.cuotasVencidas} cuotas` : '0'} 
          icon="fa-calendar-xmark" 
          color="danger" 
        />
      </div>

      <div className="card">
        <h2 className="title-md">Información General</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <p className="text-muted mb-1">Próximo Vencimiento</p>
            <p style={{ fontWeight: 500 }}>{data.fechaProximoVencimiento}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Préstamo Express</p>
            <div>
              {data.calificaPrestamoExpress 
                ? <Badge type="success">Califica</Badge>
                : <Badge type="warning">En revisión</Badge>}
            </div>
          </div>
          <div>
            <p className="text-muted mb-1">Número de Socio</p>
            <p style={{ fontWeight: 500 }}>{data.numeroSocio}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Cédula</p>
            <p style={{ fontWeight: 500 }}>{data.cedula}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { formatCurrency, Socio } from '../data/mockData';
import { memberService } from '../services/memberService';
import SocioAppHeader from '../components/socio/SocioAppHeader';
import QuickActions from '../components/socio/QuickActions';
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
    <div className="socio-desktop-content">
      <div className="mobile-only">
        <SocioAppHeader nombre={data.nombre} />
      </div>
      
      <div className="desktop-only mb-4" style={{ paddingTop: '1rem' }}>
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Hola, {data.nombre.split(' ')[0]}</h1>
        <p className="text-muted">Este es el resumen de tu estado como socio.</p>
      </div>

      <div className="socio-balance-card">
        <p className="socio-balance-title">Total Ahorrado</p>
        <h2 className="socio-balance-amount">{formatCurrency(data.totalAhorrado)}</h2>
        <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', opacity: 0.8 }}>
          <i className="fa-solid fa-vault" style={{ fontSize: '2rem' }}></i>
        </div>
      </div>

      <QuickActions />

      <div className="socio-mobile-card">
        <h3 className="title-md" style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Estado Financiero</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Pagos Pendientes</p>
            <p style={{ fontWeight: 600, margin: 0, color: 'var(--color-danger)' }}>{formatCurrency(data.pagoPendiente)}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Aportes Atrasados</p>
            <p style={{ fontWeight: 600, margin: 0 }}>{data.aportesAtrasadosMeses > 0 ? `${data.aportesAtrasadosMeses} meses` : 'Al día'}</p>
          </div>
          <div style={{ backgroundColor: data.aportesAtrasadosMeses > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: data.aportesAtrasadosMeses > 0 ? 'var(--color-warning)' : 'var(--color-success)', width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Cuotas Vencidas</p>
            <p style={{ fontWeight: 600, margin: 0 }}>{data.cuotasVencidas > 0 ? `${data.cuotasVencidas} cuotas` : '0'}</p>
          </div>
          <div style={{ backgroundColor: data.cuotasVencidas > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: data.cuotasVencidas > 0 ? 'var(--color-danger)' : 'var(--color-success)', width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <i className="fa-solid fa-calendar-xmark"></i>
          </div>
        </div>
      </div>

      <div className="socio-mobile-card">
        <h3 className="title-md" style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Información General</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Próximo Vencimiento</p>
            <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{data.fechaProximoVencimiento}</p>
          </div>
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Préstamo Express</p>
            <div>
              {data.calificaPrestamoExpress 
                ? <Badge type="success">Califica</Badge>
                : <Badge type="warning">En revisión</Badge>}
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Número de Socio</p>
            <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{data.numeroSocio}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Cédula</p>
            <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{data.cedula}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

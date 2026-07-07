import React, { useEffect, useState } from 'react';
import { formatCurrency, Socio } from '../data/mockData';
import { memberService } from '../services/memberService';
import SocioAppHeader from '../components/socio/SocioAppHeader';
import QuickActions from '../components/socio/QuickActions';
import SocioHeroCard from '../components/socio/SocioHeroCard';
import SocioFinanceCard from '../components/socio/SocioFinanceCard';
import SocioMovementItem from '../components/socio/SocioMovementItem';
import SocioStatusBadge from '../components/socio/SocioStatusBadge';
import SocioInfoRow from '../components/socio/SocioInfoRow';

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

  const isAtrasado = data.aportesAtrasadosMeses > 0 || data.cuotasVencidas > 0;

  return (
    <div className="socio-app-page">
      <div className="mobile-only">
        <SocioAppHeader nombre={data.nombre} />
      </div>
      
      <div className="desktop-only mb-4" style={{ paddingTop: '1rem' }}>
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Hola, {data.nombre.split(' ')[0]}</h1>
        <p className="text-muted">Este es el resumen de tu estado como socio.</p>
      </div>

      <SocioHeroCard 
        label="Total Ahorrado" 
        value={formatCurrency(data.totalAhorrado)} 
        gradient="primary"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', opacity: 0.9 }}>Próximo Vencimiento</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{data.fechaProximoVencimiento}</p>
          </div>
          {isAtrasado ? (
            <span style={{ backgroundColor: '#FEE4E2', color: 'var(--color-danger)', padding: '0.4rem 0.85rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(217, 45, 32, 0.2)' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              Deuda Pendiente
            </span>
          ) : (
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.85rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Al día
            </span>
          )}
        </div>
      </SocioHeroCard>

      <QuickActions />

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>
          Estado Financiero
        </h3>
      </div>

      <SocioFinanceCard>
        <div className="socio-movement-list">
          <SocioMovementItem 
            icon="fa-file-invoice-dollar"
            iconColor="danger"
            title="Pagos Pendientes"
            date="Total a pagar hoy"
            amount={formatCurrency(data.pagoPendiente)}
            amountColor="danger"
          />
          <SocioMovementItem 
            icon="fa-clock-rotate-left"
            iconColor={data.aportesAtrasadosMeses > 0 ? 'warning' : 'success'}
            title="Aportes"
            date="Estado de cuenta capital"
            amount={data.aportesAtrasadosMeses > 0 ? `${data.aportesAtrasadosMeses} meses` : 'Al día'}
            amountColor="text"
          />
          <SocioMovementItem 
            icon="fa-calendar-xmark"
            iconColor={data.cuotasVencidas > 0 ? 'danger' : 'success'}
            title="Préstamos"
            date="Cuotas vencidas"
            amount={data.cuotasVencidas > 0 ? `${data.cuotasVencidas} cuotas` : '0 cuotas'}
            amountColor={data.cuotasVencidas > 0 ? 'danger' : 'text'}
          />
        </div>
      </SocioFinanceCard>

      <div className="socio-section-title-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>
          Información General
        </h3>
      </div>

      <SocioFinanceCard>
        <SocioInfoRow label="Cédula" value={data.cedula} />
        <SocioInfoRow label="Número de Socio" value={`#${data.numeroSocio}`} />
        <SocioInfoRow label="Préstamo Express" value={
          data.calificaPrestamoExpress 
            ? <SocioStatusBadge type="success">Califica</SocioStatusBadge>
            : <SocioStatusBadge type="warning">En Revisión</SocioStatusBadge>
        } />
      </SocioFinanceCard>
    </div>
  );
};

export default Dashboard;

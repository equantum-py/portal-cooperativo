import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { formatCurrency } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminAportes: React.FC = () => {
  const [aportes, setAportes] = useState<any[]>([]);
  const [filterMes, setFilterMes] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const { showToast } = useToast();

  const loadData = () => {
    setAportes(demoStore.getAllAportes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarcarPagado = (socioId: string, aporteId: number) => {
    const socios = demoStore.getSocios();
    const socio = socios.find(s => s.id === socioId);
    if (socio) {
      const ap = socio.historialAportes.find(a => a.id === aporteId);
      if (ap) {
        ap.estado = 'pagado';
        ap.fechaPago = new Date().toLocaleDateString('es-PY');
        
        // Simular impacto en socio
        if (socio.aportesAtrasadosMeses > 0) {
          socio.aportesAtrasadosMeses -= 1;
        }
        socio.ultimoAportePagado = ap.fechaPago;
        
        demoStore.saveSocios(socios);
        showToast('Aporte marcado como pagado', 'success');
        loadData();
      }
    }
  };

  const handleNotificar = (socioId: string) => {
    demoStore.sendNotification({
      destinatario: socioId,
      tipo: 'danger',
      titulo: 'Aviso de Atraso',
      mensaje: 'Tenés aportes pendientes. Te recomendamos regularizar tu situación.',
      prioridad: 'alta',
      canal: 'app'
    });
    showToast('Aviso de atraso enviado al socio', 'success');
  };

  const filteredAportes = aportes.filter(a => {
    const mMes = filterMes === 'Todos' || a.mes.includes(filterMes);
    const mEst = filterEstado === 'Todos' || a.estado === filterEstado;
    return mMes && mEst;
  });

  const totalCobrado = filteredAportes.filter(a => a.estado === 'pagado').reduce((sum, a) => sum + a.monto, 0);
  const totalPendiente = filteredAportes.filter(a => a.estado !== 'pagado').reduce((sum, a) => sum + a.monto, 0);

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Aportes Mensuales</h1>
          <p className="text-muted">Control y registro de pagos de aportes societarios.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Cobrado (Filtro)</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(totalCobrado)}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Pendiente (Filtro)</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>{formatCurrency(totalPendiente)}</div>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Filtrar por Mes</label>
          <select className="form-control" value={filterMes} onChange={e => setFilterMes(e.target.value)}>
            <option value="Todos">Todos los meses</option>
            <option value="07/2026">Julio 2026</option>
            <option value="06/2026">Junio 2026</option>
            <option value="05/2026">Mayo 2026</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Filtrar por Estado</label>
          <select className="form-control" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="pagado">Pagados</option>
            <option value="pendiente">Pendientes</option>
            <option value="atrasado">Atrasados</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Cédula / Nro</th>
                <th style={{ padding: '1rem' }}>Mes</th>
                <th style={{ padding: '1rem' }}>Monto</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Fecha Pago</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAportes.length > 0 ? filteredAportes.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{a.socioNombre}</strong></td>
                  <td style={{ padding: '1rem' }}>{a.cedula} <br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>#{a.numeroSocio}</span></td>
                  <td style={{ padding: '1rem' }}>{a.mes}</td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(a.monto)}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type={a.estado === 'pagado' ? 'success' : a.estado === 'atrasado' ? 'danger' : 'warning'}>
                      {a.estado}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>{a.fechaPago || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {a.estado !== 'pagado' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => handleMarcarPagado(a.socioId, a.id)}>
                          Cobrar
                        </button>
                      )}
                      {a.estado === 'atrasado' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleNotificar(a.socioId)}>
                          Notificar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No se encontraron aportes con estos filtros. (Agregue registros de prueba al historialAportes del socio en mockData o genere uno nuevo).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAportes;

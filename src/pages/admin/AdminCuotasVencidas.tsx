import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { formatCurrency } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminCuotasVencidas: React.FC = () => {
  const [cuotas, setCuotas] = useState<any[]>([]);
  const { showToast } = useToast();

  const loadData = () => {
    setCuotas(demoStore.getAllCuotasVencidas());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarcarPagada = (socioId: string, cuotaId: number) => {
    const currentSocios = demoStore.getSocios();
    const index = currentSocios.findIndex(s => s.id === socioId);
    if (index !== -1) {
      const s = currentSocios[index];
      const cuota = s.historialPrestamos.find(p => p.id === cuotaId);
      if (cuota) {
        cuota.estado = 'pagado';
        cuota.fechaPago = new Date().toLocaleDateString('es-PY');
        s.cuotasVencidas--;
        s.cuotasPagadas++;
        
        demoStore.saveSocios(currentSocios);
        showToast('Cuota marcada como cobrada exitosamente', 'success');
        loadData();
      }
    }
  };

  const handleNotificarMora = (socioId: string) => {
    demoStore.sendNotification({
      destinatario: socioId,
      tipo: 'danger',
      titulo: 'Aviso de Mora',
      mensaje: 'Registramos mora en tu préstamo. Acercate a la cooperativa para más información y evitar recargos.',
      prioridad: 'urgente',
      canal: 'whatsapp'
    });
    showToast('Aviso de mora enviado por WhatsApp simulado', 'success');
  };

  const calcularDiasAtraso = (fechaVencimiento: string) => {
    if (!fechaVencimiento || fechaVencimiento === '-') return 0;
    const parts = fechaVencimiento.split('/');
    if (parts.length === 3) {
      const vDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      const hoy = new Date();
      const diffTime = Math.abs(hoy.getTime() - vDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 30; // Fallback para mock
  };

  const totalVencido = cuotas.reduce((sum, c) => sum + c.monto, 0);

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Cuotas en Mora</h1>
        <p className="text-muted">Seguimiento de cuotas de préstamos vencidas y gestión de cobros.</p>
      </div>

      <div className="card mb-4" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-danger)', display: 'inline-block' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Capital Total en Riesgo</h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>{formatCurrency(totalVencido)}</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Cuota Nro</th>
                <th style={{ padding: '1rem' }}>Monto Vencido</th>
                <th style={{ padding: '1rem' }}>Vencimiento</th>
                <th style={{ padding: '1rem' }}>Días Atraso</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.length > 0 ? cuotas.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{c.socioNombre}</strong><br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>{c.cedula}</span></td>
                  <td style={{ padding: '1rem' }}>{c.cuota}</td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(c.monto)}</td>
                  <td style={{ padding: '1rem' }}>{c.vencimiento}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-danger)', fontWeight: 600 }}>{calcularDiasAtraso(c.vencimiento)} días</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type="danger">En Mora</Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => handleMarcarPagada(c.socioId, c.id)}>
                        <i className="fa-solid fa-check" style={{ marginRight: '4px' }}></i> Cobrar
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleNotificarMora(c.socioId)}>
                        <i className="fa-brands fa-whatsapp" style={{ marginRight: '4px' }}></i> Avisar
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    ¡Excelente! No hay cuotas en mora registradas en el sistema.
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

export default AdminCuotasVencidas;

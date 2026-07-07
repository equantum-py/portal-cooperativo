import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { formatCurrency, Socio } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminPrestamos: React.FC = () => {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socios, setSocios] = useState<Socio[]>([]);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    socioId: '',
    monto: 5000000,
    cuotas: 12
  });

  const loadData = () => {
    setPrestamos(demoStore.getAllPrestamos());
    setSocios(demoStore.getSocios());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearPrestamo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.socioId) {
      showToast('Debe seleccionar un socio', 'error');
      return;
    }

    const currentSocios = demoStore.getSocios();
    const index = currentSocios.findIndex(s => s.id === form.socioId);
    if (index !== -1) {
      const s = currentSocios[index];
      // Generate cuotas
      const montoCuota = Math.round((form.monto * 1.2) / form.cuotas); // Simple interest logic 20%
      const nuevasCuotas = [];
      const baseDate = new Date();
      for (let i = 1; i <= form.cuotas; i++) {
        baseDate.setMonth(baseDate.getMonth() + 1);
        nuevasCuotas.push({
          id: Date.now() + i,
          cuota: i,
          monto: montoCuota,
          vencimiento: baseDate.toLocaleDateString('es-PY'),
          estado: 'pendiente' as 'pendiente'
        });
      }

      s.prestamoConcedido += form.monto;
      s.cuotasPendientes += form.cuotas;
      s.historialPrestamos = [...s.historialPrestamos, ...nuevasCuotas];
      s.montoProximaCuota = montoCuota;
      s.fechaProximoVencimiento = nuevasCuotas[0].vencimiento;
      
      demoStore.saveSocios(currentSocios);
      showToast('Préstamo creado con éxito', 'success');
      loadData();
      setIsModalOpen(false);
    }
  };

  const handleCancelar = (socioId: string) => {
    const currentSocios = demoStore.getSocios();
    const index = currentSocios.findIndex(s => s.id === socioId);
    if (index !== -1) {
      const s = currentSocios[index];
      s.historialPrestamos.forEach(p => {
        if (p.estado !== 'pagado') {
          p.estado = 'pagado';
          p.fechaPago = new Date().toLocaleDateString('es-PY');
          s.cuotasPagadas++;
          if (s.cuotasPendientes > 0) s.cuotasPendientes--;
          if (s.cuotasVencidas > 0) s.cuotasVencidas--;
        }
      });
      demoStore.saveSocios(currentSocios);
      showToast('Préstamo marcado como cancelado', 'info');
      loadData();
    }
  };

  const handleNotificar = (socioId: string, tipoNotif: 'mora' | 'vencimiento') => {
    if (tipoNotif === 'mora') {
      demoStore.sendNotification({
        destinatario: socioId,
        tipo: 'danger',
        titulo: 'Aviso de Mora',
        mensaje: 'Tu préstamo registra mora. Te invitamos a regularizar tu pago.',
        prioridad: 'urgente',
        canal: 'app'
      });
      showToast('Aviso de mora enviado', 'success');
    } else {
      demoStore.sendNotification({
        destinatario: socioId,
        tipo: 'warning',
        titulo: 'Próximo Vencimiento',
        mensaje: 'Tu próximo vencimiento está cerca. Evitá recargos pagando a tiempo.',
        prioridad: 'normal',
        canal: 'app'
      });
      showToast('Aviso de vencimiento enviado', 'success');
    }
  };

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Préstamos Vigentes</h1>
          <p className="text-muted">Administración y liquidación de préstamos otorgados.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-hand-holding-dollar" style={{ marginRight: '0.5rem' }}></i> Crear Préstamo
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Monto Otorgado</th>
                <th style={{ padding: '1rem' }}>Cuotas (Pag / Pend)</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Próx. Vencimiento</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.length > 0 ? prestamos.map(p => (
                <tr key={p.socioId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{p.socioNombre}</strong><br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>{p.cedula}</span></td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(p.montoOtorgado)}</td>
                  <td style={{ padding: '1rem' }}>{p.cuotasPagadas} / {p.cuotas} {p.cuotasVencidas > 0 && <span style={{color:'var(--color-danger)'}}>({p.cuotasVencidas} vencidas)</span>}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type={p.estado === 'activo' ? 'info' : p.estado === 'atrasado' ? 'danger' : 'success'}>
                      {p.estado}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>{p.proximoVencimiento}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {p.estado !== 'cancelado' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleCancelar(p.socioId)}>
                          Liquidar Total
                        </button>
                      )}
                      {p.estado === 'atrasado' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleNotificar(p.socioId, 'mora')}>
                          Avisar Mora
                        </button>
                      )}
                      {p.estado === 'activo' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }} onClick={() => handleNotificar(p.socioId, 'vencimiento')}>
                          Aviso Vencimiento
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No hay préstamos vigentes registrados en la cooperativa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">Otorgar Nuevo Préstamo</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCrearPrestamo}>
              <div className="form-group">
                <label className="form-label">Socio Beneficiario</label>
                <select className="form-control" required value={form.socioId} onChange={e => setForm({...form, socioId: e.target.value})}>
                  <option value="" disabled>Seleccione un socio...</option>
                  {socios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} ({s.cedula})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monto a Otorgar (Gs.)</label>
                <input type="number" className="form-control" required min="100000" step="50000" value={form.monto} onChange={e => setForm({...form, monto: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad de Cuotas (Meses)</label>
                <select className="form-control" value={form.cuotas} onChange={e => setForm({...form, cuotas: Number(e.target.value)})}>
                  <option value={6}>6 Cuotas</option>
                  <option value={12}>12 Cuotas</option>
                  <option value={18}>18 Cuotas</option>
                  <option value={24}>24 Cuotas</option>
                  <option value={36}>36 Cuotas</option>
                </select>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-info-light)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <strong>Simulación (20% interés):</strong> {formatCurrency(Math.round((form.monto * 1.2) / form.cuotas))} mensuales.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Generar Préstamo y Cuotas</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrestamos;

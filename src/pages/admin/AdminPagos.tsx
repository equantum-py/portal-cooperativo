import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { PagoAdmin, formatCurrency, Socio } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminPagos: React.FC = () => {
  const [pagos, setPagos] = useState<PagoAdmin[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<PagoAdmin>>({
    socioId: '',
    tipoPago: 'aporte',
    monto: 0,
    estado: 'pagado',
    fechaVencimiento: new Date().toLocaleDateString('es-PY'),
    fechaPago: new Date().toLocaleDateString('es-PY'),
    metodoPago: 'efectivo',
    observacion: ''
  });

  const loadData = () => {
    setPagos(demoStore.getPagos());
    setSocios(demoStore.getSocios());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGuardarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.socioId) {
      showToast('Seleccione un socio', 'error');
      return;
    }
    const socio = socios.find(s => s.id === form.socioId);
    if (!socio) return;

    const newPago: PagoAdmin = {
      id: Date.now(),
      socioId: socio.id,
      socioNombre: socio.nombre,
      cedula: socio.cedula,
      numeroSocio: socio.numeroSocio,
      tipoPago: form.tipoPago as any,
      monto: Number(form.monto),
      estado: form.estado as any,
      fechaVencimiento: form.fechaVencimiento || '-',
      fechaPago: form.estado === 'pagado' ? (form.fechaPago || new Date().toLocaleDateString('es-PY')) : undefined,
      metodoPago: form.metodoPago as any,
      observacion: form.observacion
    };

    const currentPagos = demoStore.getPagos();
    currentPagos.unshift(newPago);
    demoStore.savePagos(currentPagos);

    // Simular impacto en demoStore
    if (newPago.estado === 'pagado') {
      const currentSocios = demoStore.getSocios();
      const s = currentSocios.find(x => x.id === socio.id);
      if (s) {
        if (newPago.tipoPago === 'aporte' && s.aportesAtrasadosMeses > 0) s.aportesAtrasadosMeses--;
        if (newPago.tipoPago === 'cuota de préstamo' && s.cuotasVencidas > 0) {
           s.cuotasVencidas--;
           s.cuotasPagadas++;
        }
        demoStore.saveSocios(currentSocios);
      }
    }

    showToast('Pago registrado exitosamente', 'success');
    setIsModalOpen(false);
    loadData();
  };

  const handleNotificar = (socioId: string) => {
    demoStore.sendNotification({
      destinatario: socioId,
      tipo: 'warning',
      titulo: 'Aviso de Pago Pendiente',
      mensaje: 'Recordatorio: tenés un pago pendiente de liquidación.',
      prioridad: 'normal',
      canal: 'app'
    });
    showToast('Notificación de pago enviada', 'info');
  };

  const handleMarcarPagado = (id: number) => {
    const currentPagos = demoStore.getPagos();
    const p = currentPagos.find(x => x.id === id);
    if (p && p.estado !== 'pagado') {
      p.estado = 'pagado';
      p.fechaPago = new Date().toLocaleDateString('es-PY');
      demoStore.savePagos(currentPagos);
      showToast('Pago actualizado a Pagado', 'success');
      loadData();
    }
  };

  const filteredPagos = pagos.filter(p => {
    const matchSearch = p.socioNombre.toLowerCase().includes(search.toLowerCase()) || p.cedula.includes(search) || p.numeroSocio.includes(search);
    const matchTipo = filterTipo === 'Todos' || p.tipoPago === filterTipo;
    const matchEstado = filterEstado === 'Todos' || p.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  const totalPagado = filteredPagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = filteredPagos.filter(p => p.estado === 'pendiente').reduce((sum, p) => sum + p.monto, 0);
  const vencidosCount = filteredPagos.filter(p => p.estado === 'vencido').length;

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Registro de Pagos</h1>
          <p className="text-muted">Gestión centralizada de todos los cobros y obligaciones.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus" style={{ marginRight: '0.5rem' }}></i> Registrar Pago
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Pagado (Mes)</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(totalPagado)}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Pendiente</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>{formatCurrency(totalPendiente)}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-danger)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Pagos Vencidos</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>{vencidosCount} registros</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-info)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Cant. Registros</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-info)' }}>{filteredPagos.length}</div>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '250px' }}>
          <label className="form-label">Buscar Socio</label>
          <input type="text" className="form-control" placeholder="Nombre, cédula o Nro..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="form-label">Tipo</label>
          <select className="form-control" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="aporte">Aporte</option>
            <option value="cuota de préstamo">Cuota</option>
            <option value="ahorro">Ahorro</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="form-label">Estado</label>
          <select className="form-control" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="pagado">Pagados</option>
            <option value="pendiente">Pendientes</option>
            <option value="vencido">Vencidos</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Concepto</th>
                <th style={{ padding: '1rem' }}>Monto</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Fecha</th>
                <th style={{ padding: '1rem' }}>Método</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPagos.length > 0 ? filteredPagos.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{p.socioNombre}</strong><br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>{p.cedula}</span></td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{p.tipoPago}</td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(p.monto)}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type={p.estado === 'pagado' ? 'success' : p.estado === 'vencido' ? 'danger' : 'warning'}>
                      {p.estado}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {p.estado === 'pagado' ? p.fechaPago : `Vto: ${p.fechaVencimiento}`}
                  </td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{p.metodoPago}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {p.estado !== 'pagado' && (
                        <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => handleMarcarPagado(p.id)}>
                          Cobrar
                        </button>
                      )}
                      {p.estado !== 'pagado' && (
                        <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleNotificar(p.socioId)}>
                          Avisar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No hay pagos que coincidan con los filtros.
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
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">Registrar Nuevo Pago / Deuda</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleGuardarPago}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Socio</label>
                  <select className="form-control" required value={form.socioId} onChange={e => setForm({...form, socioId: e.target.value})}>
                    <option value="" disabled>Seleccione socio...</option>
                    {socios.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} ({s.cedula})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Pago</label>
                  <select className="form-control" value={form.tipoPago} onChange={e => setForm({...form, tipoPago: e.target.value as any})}>
                    <option value="aporte">Aporte Mensual</option>
                    <option value="cuota de préstamo">Cuota de Préstamo</option>
                    <option value="ahorro">Caja de Ahorro</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Monto (Gs.)</label>
                  <input type="number" className="form-control" required min="1000" value={form.monto} onChange={e => setForm({...form, monto: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-control" value={form.estado} onChange={e => setForm({...form, estado: e.target.value as any})}>
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Método</label>
                  <select className="form-control" value={form.metodoPago} onChange={e => setForm({...form, metodoPago: e.target.value as any})}>
                    <option value="efectivo">Efectivo (Caja)</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="giro">Giro</option>
                    <option value="-">- (No pagado)</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Observación</label>
                  <input type="text" className="form-control" placeholder="Opcional..." value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPagos;

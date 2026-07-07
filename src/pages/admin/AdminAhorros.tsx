import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { Socio, Movimiento, formatCurrency } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminAhorros: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);

  const [form, setForm] = useState({
    tipo: 'deposito',
    monto: 0,
    concepto: ''
  });

  const loadData = () => {
    setSocios(demoStore.getSocios());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMovimiento = (socio: Socio, tipo: string) => {
    setSelectedSocio(socio);
    setForm({ tipo, monto: 0, concepto: tipo === 'deposito' ? 'Depósito en ventanilla' : 'Retiro de fondos' });
    setIsModalOpen(true);
  };

  const handleOpenHistorial = (socio: Socio) => {
    setSelectedSocio(socio);
    setIsHistorialOpen(true);
  };

  const handleGuardarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSocio || form.monto <= 0) return;

    if (form.tipo === 'retiro' && form.monto > selectedSocio.saldoDisponibleAhorro) {
      showToast('Fondos insuficientes para el retiro', 'error');
      return;
    }

    const currentSocios = demoStore.getSocios();
    const s = currentSocios.find(x => x.id === selectedSocio.id);
    if (s) {
      const nuevoMov: Movimiento = {
        id: Date.now(),
        tipo: form.tipo as any,
        concepto: form.concepto,
        monto: form.monto,
        fecha: new Date().toLocaleDateString('es-PY')
      };
      
      s.movimientosAhorro.unshift(nuevoMov);
      
      if (form.tipo === 'deposito') {
        s.totalAhorrado += form.monto;
        s.saldoDisponibleAhorro += form.monto;
      } else {
        s.saldoDisponibleAhorro -= form.monto;
      }

      demoStore.saveSocios(currentSocios);
      showToast(`Movimiento de ${form.tipo} registrado correctamente`, 'success');
      setIsModalOpen(false);
      loadData();
    }
  };

  // Resumen
  const totalGeneral = socios.reduce((sum, s) => sum + s.saldoDisponibleAhorro, 0);
  const activos = socios.filter(s => s.saldoDisponibleAhorro > 0).length;

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Gestión de Ahorros</h1>
          <p className="text-muted">Administración de saldos y caja de ahorro de los socios.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Ahorrado (Global)</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(totalGeneral)}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-info)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Socios con Ahorro Activo</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-info)' }}>{activos}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Saldo Disponible</th>
                <th style={{ padding: '1rem' }}>Último Movimiento</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{s.nombre}</strong><br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>{s.cedula}</span></td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatCurrency(s.saldoDisponibleAhorro)}</td>
                  <td style={{ padding: '1rem' }}>
                    {s.movimientosAhorro.length > 0 ? (
                      <span className="text-muted">{s.movimientosAhorro[0].fecha} ({s.movimientosAhorro[0].tipo})</span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type={s.saldoDisponibleAhorro > 0 ? 'success' : 'info'}>
                      {s.saldoDisponibleAhorro > 0 ? 'Con Fondos' : 'En Cero'}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleOpenHistorial(s)}>
                        Historial
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--color-success)', borderColor: 'var(--color-success)' }} onClick={() => handleOpenMovimiento(s, 'deposito')}>
                        Depósito
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleOpenMovimiento(s, 'retiro')}>
                        Retiro
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedSocio && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">Registrar {form.tipo === 'deposito' ? 'Depósito' : 'Retiro'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <p className="text-muted mb-3">Socio: <strong>{selectedSocio.nombre}</strong></p>
            {form.tipo === 'retiro' && (
              <p className="text-muted mb-3" style={{ color: 'var(--color-danger)' }}>Saldo disponible: {formatCurrency(selectedSocio.saldoDisponibleAhorro)}</p>
            )}

            <form onSubmit={handleGuardarMovimiento}>
              <div className="form-group">
                <label className="form-label">Monto (Gs.)</label>
                <input type="number" className="form-control" required min="1000" value={form.monto} onChange={e => setForm({...form, monto: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Concepto</label>
                <input type="text" className="form-control" required value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHistorialOpen && selectedSocio && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">Historial: {selectedSocio.nombre}</h2>
              <button onClick={() => setIsHistorialOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {selectedSocio.movimientosAhorro.length === 0 ? (
              <p className="text-muted text-center py-4">No hay movimientos registrados.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.5rem' }}>Fecha</th>
                    <th style={{ padding: '0.5rem' }}>Tipo</th>
                    <th style={{ padding: '0.5rem' }}>Concepto</th>
                    <th style={{ padding: '0.5rem' }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSocio.movimientosAhorro.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.5rem' }}>{m.fecha}</td>
                      <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>
                        <span style={{ color: m.tipo === 'retiro' ? 'var(--color-danger)' : 'var(--color-success)' }}>{m.tipo}</span>
                      </td>
                      <td style={{ padding: '0.5rem' }}>{m.concepto}</td>
                      <td style={{ padding: '0.5rem' }}>{formatCurrency(m.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAhorros;

import React, { useState, useEffect } from 'react';
import { formatCurrency, Socio } from '../../data/mockData';
import { demoStore } from '../../services/demoStore';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const defaultSocio: Omit<Socio, 'id'> = {
  nombre: '',
  cedula: '',
  numeroSocio: '',
  telefono: '',
  email: '',
  direccion: '',
  fechaIngreso: new Date().toLocaleDateString('es-PY'),
  estadoSocio: 'Activo',
  aporteMensual: 100000,
  aportesAtrasadosMeses: 0,
  aportesAtrasadosMonto: 0,
  ultimoAportePagado: '-',
  mesesPagadosAporte: 0,
  mesesPendientesAporte: 0,
  prestamoConcedido: 0,
  cuotasPagadas: 0,
  cuotasPendientes: 0,
  cuotasVencidas: 0,
  montoProximaCuota: 0,
  fechaProximoVencimiento: '-',
  totalAhorrado: 0,
  saldoDisponibleAhorro: 0,
  pagoPendiente: 0,
  calificaPrestamoExpress: true,
  notificaciones: [],
  movimientosAhorro: [],
  historialAportes: [],
  historialPrestamos: []
};

const AdminSocios: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocio, setEditingSocio] = useState<Socio | Omit<Socio, 'id'> | null>(null);
  const { showToast } = useToast();

  const loadSocios = () => {
    setSocios(demoStore.getSocios());
  };

  useEffect(() => {
    loadSocios();
  }, []);

  const filteredSocios = socios.filter(socio => {
    const matchesSearch = 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      socio.cedula.includes(searchTerm) || 
      socio.numeroSocio.includes(searchTerm) ||
      socio.telefono.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'Todos' || socio.estadoSocio === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (socio?: Socio) => {
    if (socio) {
      setEditingSocio({ ...socio });
    } else {
      setEditingSocio({ ...defaultSocio });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSocio(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocio) return;

    if ('id' in editingSocio) {
      demoStore.updateSocio(editingSocio as Socio);
      showToast('Socio actualizado correctamente', 'success');
    } else {
      demoStore.addSocio(editingSocio);
      showToast('Nuevo socio agregado', 'success');
    }
    loadSocios();
    handleCloseModal();
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    demoStore.toggleSocioStatus(id, newStatus as any);
    showToast(`Socio marcado como ${newStatus}`, 'info');
    loadSocios();
    handleCloseModal();
  };

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Padrón de Socios</h1>
          <p className="text-muted">Gestión integral de los miembros de la cooperativa.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <i className="fa-solid fa-user-plus" style={{ marginRight: '0.5rem' }}></i> Agregar Socio
          </button>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar por nombre, cédula o número de socio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select 
            className="form-control" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Atrasado">Atrasados</option>
            <option value="Inactivo">Inactivos</option>
            <option value="Pendiente">Pendientes</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Socio</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Nro. Socio</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Cédula</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Contacto</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Estado</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Aporte / Atrasos</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Total Ahorrado</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSocios.length > 0 ? (
                filteredSocios.map((socio) => (
                  <tr key={socio.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}><strong>{socio.nombre}</strong></td>
                    <td style={{ padding: '1rem' }}>{socio.numeroSocio}</td>
                    <td style={{ padding: '1rem' }}>{socio.cedula}</td>
                    <td style={{ padding: '1rem' }}>{socio.telefono}</td>
                    <td style={{ padding: '1rem' }}>
                      <Badge type={
                        socio.estadoSocio === 'Activo' ? 'success' :
                        socio.estadoSocio === 'Atrasado' ? 'danger' :
                        socio.estadoSocio === 'Pendiente' ? 'warning' : 'info'
                      }>
                        {socio.estadoSocio}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{formatCurrency(socio.aporteMensual)}</div>
                      {socio.aportesAtrasadosMeses > 0 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: '4px' }}>
                          <i className="fa-solid fa-triangle-exclamation"></i> {socio.aportesAtrasadosMeses} meses atraso
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>{formatCurrency(socio.totalAhorrado)}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleOpenModal(socio)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No se encontraron socios con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edición / Creación */}
      {isModalOpen && editingSocio && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">{'id' in editingSocio ? 'Editar Socio' : 'Agregar Nuevo Socio'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control" required value={editingSocio.nombre} onChange={e => setEditingSocio({...editingSocio, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cédula</label>
                  <input type="text" className="form-control" required value={editingSocio.cedula} onChange={e => setEditingSocio({...editingSocio, cedula: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Número de Socio</label>
                  <input type="text" className="form-control" required value={editingSocio.numeroSocio} onChange={e => setEditingSocio({...editingSocio, numeroSocio: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-control" value={editingSocio.estadoSocio} onChange={e => setEditingSocio({...editingSocio, estadoSocio: e.target.value as Socio['estadoSocio']})}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Atrasado">Atrasado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="form-control" value={editingSocio.telefono} onChange={e => setEditingSocio({...editingSocio, telefono: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={editingSocio.email} onChange={e => setEditingSocio({...editingSocio, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input type="text" className="form-control" value={editingSocio.direccion} onChange={e => setEditingSocio({...editingSocio, direccion: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Aporte Mensual (Gs.)</label>
                  <input type="number" className="form-control" value={editingSocio.aporteMensual} onChange={e => setEditingSocio({...editingSocio, aporteMensual: Number(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                {'id' in editingSocio ? (
                  <button type="button" className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleToggleStatus(editingSocio.id, editingSocio.estadoSocio)}>
                    <i className={`fa-solid ${editingSocio.estadoSocio === 'Activo' ? 'fa-user-slash' : 'fa-user-check'}`} style={{ marginRight: '0.5rem' }}></i>
                    {editingSocio.estadoSocio === 'Activo' ? 'Deshabilitar Socio' : 'Habilitar Socio'}
                  </button>
                ) : <div></div>}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocios;

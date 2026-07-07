import React, { useState, useEffect } from 'react';
import { demoStore } from '../../services/demoStore';
import { SolicitudAdmin, Socio } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/Badge';

const AdminSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudAdmin | null>(null);
  const [observacion, setObservacion] = useState('');

  const loadData = () => {
    setSolicitudes(demoStore.getSolicitudes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (sol: SolicitudAdmin) => {
    setSelectedSolicitud(sol);
    setObservacion(sol.observacion || '');
    setIsModalOpen(true);
  };

  const updateEstado = (nuevoEstado: SolicitudAdmin['estado']) => {
    if (!selectedSolicitud) return;

    const currentSolicitudes = demoStore.getSolicitudes();
    const index = currentSolicitudes.findIndex(s => s.id === selectedSolicitud.id);
    if (index !== -1) {
      currentSolicitudes[index].estado = nuevoEstado;
      currentSolicitudes[index].observacion = observacion;
      demoStore.saveSolicitudes(currentSolicitudes);
      showToast(`Solicitud marcada como ${nuevoEstado}`, 'success');
      
      // Si la solicitud es de un socio existente, notificar
      const socios = demoStore.getSocios();
      const socioRelacionado = socios.find(s => s.cedula === currentSolicitudes[index].cedula);
      if (socioRelacionado && (nuevoEstado === 'aprobado' || nuevoEstado === 'rechazado')) {
        demoStore.sendNotification({
          destinatario: socioRelacionado.id,
          tipo: nuevoEstado === 'aprobado' ? 'success' : 'danger',
          titulo: `Solicitud ${nuevoEstado === 'aprobado' ? 'Aprobada' : 'Rechazada'}`,
          mensaje: `Tu solicitud de ${currentSolicitudes[index].tipo} ha sido ${nuevoEstado}.`,
          prioridad: 'normal',
          canal: 'app'
        });
      }

      setIsModalOpen(false);
      loadData();
    }
  };

  const handleConvertirSocio = () => {
    if (!selectedSolicitud) return;

    // Verificar si ya existe
    const socios = demoStore.getSocios();
    const existe = socios.find(s => s.cedula === selectedSolicitud.cedula);
    if (existe) {
      showToast('Ya existe un socio con esta cédula', 'error');
      return;
    }

    const nuevoSocio: Omit<Socio, 'id'> = {
      nombre: selectedSolicitud.nombre,
      cedula: selectedSolicitud.cedula,
      numeroSocio: `00${Math.floor(1000 + Math.random() * 9000)}`,
      telefono: selectedSolicitud.telefono,
      email: selectedSolicitud.email,
      direccion: selectedSolicitud.ciudad,
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
      calificaPrestamoExpress: false,
      notificaciones: [
        {
          id: Date.now(),
          tipo: 'success',
          titulo: '¡Bienvenido a Equantum!',
          mensaje: 'Tu solicitud de asociación fue aprobada.',
          fecha: new Date().toLocaleDateString('es-PY')
        }
      ],
      movimientosAhorro: [],
      historialAportes: [],
      historialPrestamos: []
    };

    demoStore.addSocio(nuevoSocio);
    
    // Marcar solicitud como aprobada
    const currentSolicitudes = demoStore.getSolicitudes();
    const index = currentSolicitudes.findIndex(s => s.id === selectedSolicitud.id);
    if (index !== -1) {
      currentSolicitudes[index].estado = 'aprobado';
      currentSolicitudes[index].observacion = 'Convertido a Socio exitosamente.';
      demoStore.saveSolicitudes(currentSolicitudes);
    }

    showToast('Solicitud convertida en socio', 'success');
    setIsModalOpen(false);
    loadData();
  };

  const filteredSolicitudes = solicitudes.filter(s => {
    const matchSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) || s.cedula.includes(search) || s.telefono.includes(search);
    const matchTipo = filterTipo === 'Todos' || s.tipo === filterTipo;
    const matchEstado = filterEstado === 'Todos' || s.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
  const aprobadas = solicitudes.filter(s => s.estado === 'aprobado').length;
  const contactadas = solicitudes.filter(s => s.estado === 'contactado').length;
  const express = solicitudes.filter(s => s.tipo === 'préstamo express').length;

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Bandeja de Solicitudes</h1>
          <p className="text-muted">Gestión de nuevos socios, préstamos y trámites.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-warning)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Pendientes</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>{pendientes}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-info)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Contactadas</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-info)' }}>{contactadas}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Aprobadas</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>{aprobadas}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>P. Express</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{express}</div>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '250px' }}>
          <label className="form-label">Buscar Solicitante</label>
          <input type="text" className="form-control" placeholder="Nombre, cédula o teléfono..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label className="form-label">Tipo de Solicitud</label>
          <select className="form-control" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="Todos">Todas</option>
            <option value="nuevo socio">Nuevo Socio</option>
            <option value="préstamo express">Préstamo Express</option>
            <option value="actualización de datos">Actualización</option>
            <option value="general">General</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label className="form-label">Estado</label>
          <select className="form-control" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="contactado">Contactados</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Solicitante</th>
                <th style={{ padding: '1rem' }}>Contacto</th>
                <th style={{ padding: '1rem' }}>Tipo</th>
                <th style={{ padding: '1rem' }}>Fecha</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitudes.length > 0 ? filteredSolicitudes.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{s.nombre}</strong><br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>CI: {s.cedula}</span></td>
                  <td style={{ padding: '1rem' }}>{s.telefono}<br/><span style={{fontSize:'0.8rem', color:'var(--color-text-light)'}}>{s.email}</span></td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{s.tipo}</td>
                  <td style={{ padding: '1rem' }}>{s.fecha}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge type={s.estado === 'aprobado' ? 'success' : s.estado === 'rechazado' ? 'danger' : s.estado === 'contactado' ? 'info' : 'warning'}>
                      {s.estado}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleOpenModal(s)}>
                      Revisar
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No hay solicitudes que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedSolicitud && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="title-md">Detalle de Solicitud</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div><small className="text-muted">Nombre Completo</small><p><strong>{selectedSolicitud.nombre}</strong></p></div>
              <div><small className="text-muted">Cédula de Identidad</small><p>{selectedSolicitud.cedula}</p></div>
              <div><small className="text-muted">Teléfono</small><p>{selectedSolicitud.telefono}</p></div>
              <div><small className="text-muted">Email</small><p>{selectedSolicitud.email}</p></div>
              <div><small className="text-muted">Ciudad</small><p>{selectedSolicitud.ciudad}</p></div>
              <div><small className="text-muted">Tipo de Trámite</small><p style={{ textTransform: 'capitalize' }}>{selectedSolicitud.tipo}</p></div>
              <div style={{ gridColumn: '1 / -1' }}><small className="text-muted">Mensaje / Motivo</small><p style={{ backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>{selectedSolicitud.mensaje}</p></div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Observación Interna (Solo admin)</label>
              <textarea className="form-control" rows={2} value={observacion} onChange={e => setObservacion(e.target.value)}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              {selectedSolicitud.estado !== 'rechazado' && (
                <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => updateEstado('rechazado')}>
                  Rechazar
                </button>
              )}
              {selectedSolicitud.estado !== 'contactado' && (
                <button className="btn btn-outline" style={{ color: 'var(--color-info)', borderColor: 'var(--color-info)' }} onClick={() => updateEstado('contactado')}>
                  Marcar Contactado
                </button>
              )}
              {selectedSolicitud.estado !== 'aprobado' && (
                <button className="btn btn-primary" onClick={() => updateEstado('aprobado')}>
                  Aprobar
                </button>
              )}
              {selectedSolicitud.tipo === 'nuevo socio' && (selectedSolicitud.estado === 'aprobado' || selectedSolicitud.estado === 'pendiente') && (
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-success)' }} onClick={handleConvertirSocio}>
                  <i className="fa-solid fa-user-plus" style={{ marginRight: '0.5rem' }}></i> Crear Socio
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSolicitudes;

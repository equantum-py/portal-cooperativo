import React, { useState } from 'react';
import { mockSociosList, formatCurrency } from '../../data/mockData';
import Badge from '../../components/Badge';

const AdminSocios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredSocios = mockSociosList.filter(socio => {
    const matchesSearch = 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      socio.cedula.includes(searchTerm) || 
      socio.numeroSocio.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'Todos' || socio.estadoSocio === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Padrón de Socios</h1>
          <p className="text-muted">Gestión integral de los miembros de la cooperativa.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">
            <i className="fa-solid fa-file-import" style={{ marginRight: '0.5rem' }}></i> Importar
          </button>
          <button className="btn btn-outline">
            <i className="fa-solid fa-file-export" style={{ marginRight: '0.5rem' }}></i> Exportar
          </button>
          <button className="btn btn-primary">
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
                        socio.estadoSocio === 'Pendiente' ? 'warning' : 'default'
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
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Ver / Editar
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
    </div>
  );
};

export default AdminSocios;

import React from 'react';

const AdminImportExport: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Importar y Exportar Datos</h1>
        <p className="text-muted">Gestión masiva de la base de datos a través de archivos Excel (.xlsx, .csv).</p>
      </div>

      <div style={{ backgroundColor: 'var(--color-info-light)', borderLeft: '4px solid var(--color-info)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <strong>Nota:</strong> En la versión de producción conectada a Supabase, esta sección procesará planillas Excel reales. Actualmente opera en Modo Demo.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Importar */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '0.5rem' }}></i> Importar Datos
          </h2>
          <div style={{ 
            border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', 
            padding: '3rem 1rem', textAlign: 'center', backgroundColor: 'var(--color-bg)', marginBottom: '1.5rem', cursor: 'pointer'
          }}>
            <i className="fa-solid fa-file-excel" style={{ fontSize: '3rem', color: 'var(--color-success)', marginBottom: '1rem' }}></i>
            <p style={{ margin: 0, fontWeight: 500 }}>Arrastrá tu archivo Excel aquí</p>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Soporta xlsx y csv hasta 10MB</p>
          </div>
          
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Seleccionar Destino de Importación:</h3>
          <select className="form-control" style={{ marginBottom: '1rem' }}>
            <option>Padrón de Socios</option>
            <option>Aportes Mensuales</option>
            <option>Préstamos y Cuotas</option>
            <option>Registro de Pagos</option>
          </select>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Simulación: Archivo procesado correctamente.')}>
            Procesar Archivo
          </button>
        </div>

        {/* Exportar */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-cloud-arrow-down" style={{ marginRight: '0.5rem' }}></i> Exportar Base Completa
          </h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            Descargá una copia de seguridad o extraé los datos para trabajarlos en sistemas contables de escritorio.
          </p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ padding: '0.8rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Padrón de Socios</span>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}>Descargar</button>
            </li>
            <li style={{ padding: '0.8rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Reportes Financieros (Aportes/Préstamos)</span>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}>Descargar</button>
            </li>
            <li style={{ padding: '0.8rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Backup de Sistema Completo</span>
              <button className="btn btn-primary" style={{ padding: '0.2rem 0.8rem', fontSize: '0.8rem' }}>Generar Backup</button>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default AdminImportExport;

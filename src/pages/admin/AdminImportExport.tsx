import React, { useState } from 'react';
import { demoStore } from '../../services/demoStore';
import { useToast } from '../../context/ToastContext';
import { mockFlujoCajaMensual } from '../../data/mockData';

const AdminImportExport: React.FC = () => {
  const { showToast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [importTipo, setImportTipo] = useState('socios');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ total: number, valid: number, errors: number, columnasDetectadas: string[], faltanObligatorias: boolean } | null>(null);

  const columnasEsperadas = [
    'nombre', 'apellido', 'cedula', 'telefono', 'email', 'direccion', 'ciudad',
    'numero_socio', 'estado', 'aporte_mensual', 'aportes_atrasados', 'total_ahorrado',
    'prestamo_activo', 'cantidad_prestamos', 'monto_prestamo', 'cuotas_pagadas',
    'cuotas_pendientes', 'cuotas_vencidas', 'proximo_vencimiento', 'pago_pendiente', 'observacion'
  ];

  const columnasObligatorias = [
    'nombre', 'apellido', 'cedula', 'telefono', 'numero_socio', 'aporte_mensual'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleSimularImportacion = () => {
    if (!file) {
      showToast('Seleccione un archivo primero', 'error');
      return;
    }
    setImporting(true);
    setImportResult(null);
    
    setTimeout(() => {
      // Simulate reading Excel/CSV
      const simulatedTotal = Math.floor(Math.random() * 50) + 10;
      const simulatedErrors = Math.floor(Math.random() * 5);
      
      // Simular detección de columnas
      const detectadas = importTipo === 'socios' 
        ? ['nombre', 'apellido', 'cedula', 'telefono', 'numero_socio', 'aporte_mensual', 'email'] // simulamos que detectó estas
        : ['col1', 'col2'];

      const faltanObligatorias = importTipo === 'socios' 
        ? !columnasObligatorias.every(col => detectadas.includes(col)) 
        : false;
      
      setImportResult({
        total: simulatedTotal,
        valid: simulatedTotal - simulatedErrors,
        errors: simulatedErrors,
        columnasDetectadas: detectadas,
        faltanObligatorias
      });
      setImporting(false);
      showToast('Simulación completada', 'info');
    }, 1500);
  };

  const handleConfirmarImportacion = () => {
    if (!importResult) return;
    
    setImporting(true);
    setTimeout(() => {
      if (importTipo === 'socios') {
        const fakeSocio = {
          nombre: `Importado ${Math.floor(Math.random() * 1000)}`,
          cedula: `99${Math.floor(Math.random() * 100000)}`,
          numeroSocio: `00${Math.floor(Math.random() * 9000)}`,
          telefono: '0981 000 000',
          email: 'importado@demo.com',
          direccion: 'Demo',
          fechaIngreso: new Date().toLocaleDateString('es-PY'),
          estadoSocio: 'Activo' as 'Activo',
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
          notificaciones: [],
          movimientosAhorro: [],
          historialAportes: [],
          historialPrestamos: []
        };
        demoStore.addSocio(fakeSocio);
      }

      setImporting(false);
      setImportResult(null);
      setFile(null);
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
      
      showToast(`Importación exitosa en modo demo. ${importResult.valid} registros procesados.`, 'success');
    }, 1000);
  };

  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || !rows.length) {
      showToast('No hay datos para exportar', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(row => Object.values(row).map(v => {
        if (typeof v === 'object') return '"[Objeto Complejo]"';
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Archivo ${filename}.csv generado`, 'success');
    }
  };

  const handleDescargarPlantilla = () => {
    const csvContent = columnasEsperadas.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'plantilla_socios_cooperativa.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Plantilla CSV descargada exitosamente.', 'success');
    }
  };

  const handleExport = (tipo: string) => {
    let data: any[] = [];
    const ts = new Date().toISOString().split('T')[0];

    try {
      switch (tipo) {
        case 'socios': data = demoStore.getSocios(); break;
        case 'aportes': data = demoStore.getAllAportes(); break;
        case 'prestamos': data = demoStore.getAllPrestamos(); break;
        case 'cuotas_vencidas': data = demoStore.getAllCuotasVencidas(); break;
        case 'pagos': data = demoStore.getPagos(); break;
        case 'ahorros': data = demoStore.getSocios().map(s => ({ cedula: s.cedula, nombre: s.nombre, saldo: s.saldoDisponibleAhorro })); break;
        case 'solicitudes': data = demoStore.getSolicitudes(); break;
        case 'flujo_caja': data = mockFlujoCajaMensual; break;
        case 'base_completa': 
          data = demoStore.getSocios().map(s => ({
            cedula: s.cedula, nombre: s.nombre, estado: s.estadoSocio,
            aporteMes: s.aporteMensual, prestamo: s.prestamoConcedido, ahorro: s.totalAhorrado
          }));
          break;
      }

      if (data.length > 0) {
        exportToCSV(`export_${tipo}_${ts}`, data);
      } else {
        showToast('No hay datos disponibles para exportar', 'warning');
      }
    } catch (e) {
      showToast('Error al exportar en modo demo', 'error');
    }
  };

  const exportOptions = [
    { id: 'socios', label: 'Exportar Socios', icon: 'fa-users' },
    { id: 'aportes', label: 'Exportar Aportes', icon: 'fa-hand-holding-dollar' },
    { id: 'prestamos', label: 'Exportar Préstamos', icon: 'fa-money-bill-transfer' },
    { id: 'cuotas_vencidas', label: 'Exportar Cuotas Vencidas', icon: 'fa-triangle-exclamation' },
    { id: 'pagos', label: 'Exportar Pagos', icon: 'fa-receipt' },
    { id: 'ahorros', label: 'Exportar Ahorros', icon: 'fa-vault' },
    { id: 'solicitudes', label: 'Exportar Solicitudes', icon: 'fa-clipboard-list' },
    { id: 'flujo_caja', label: 'Exportar Flujo de Caja', icon: 'fa-chart-line' },
    { id: 'base_completa', label: 'Exportar Base Completa Demo', icon: 'fa-database' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Importar / Exportar Datos</h1>
        <p className="text-muted">Migración y resguardo de información (Archivos CSV/Excel).</p>
      </div>

      <div style={{ backgroundColor: 'var(--color-warning-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--color-warning)' }}>
        <h4 style={{ color: 'var(--color-warning-dark)', margin: '0 0 0.5rem 0' }}><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>Aviso Importante</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-warning-dark)' }}>
          En esta versión demo la importación es simulada y los datos se guardan en localStorage temporalmente. 
          En producción, estos datos se guardarán en <strong>Supabase/PostgreSQL</strong> y alimentarán automáticamente el panel administrativo y la app del socio en tiempo real.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* PANEL IMPORTAR */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-file-import" style={{ color: 'var(--color-primary)' }}></i> Importar Datos
          </h2>
          
          <div className="form-group mb-3">
            <label className="form-label">Tipo de Importación</label>
            <select className="form-control" value={importTipo} onChange={e => setImportTipo(e.target.value)}>
              <option value="socios">Socios</option>
              <option value="aportes">Aportes</option>
              <option value="prestamos">Préstamos</option>
              <option value="pagos">Pagos</option>
              <option value="ahorros">Ahorros</option>
              <option value="solicitudes">Solicitudes</option>
            </select>
          </div>
          
          <div className="form-group mb-4">
            <label className="form-label">Seleccionar Archivo (.csv, .xlsx)</label>
            <div style={{ border: '2px dashed var(--color-border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)' }}>
              <input type="file" id="file-upload" accept=".csv, .xlsx, .xls" style={{ display: 'none' }} onChange={handleFileChange} />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
                <p style={{ margin: 0 }}>
                  {file ? <strong>{file.name}</strong> : 'Hacé clic para buscar un archivo'}
                </p>
              </label>
            </div>
          </div>

          {importResult && (
            <div style={{ padding: '1rem', backgroundColor: importResult.faltanObligatorias ? 'var(--color-danger-light)' : 'var(--color-info-light)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Resumen de Simulación</h4>
              <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Archivo: <strong>{file?.name}</strong></li>
                <li>Tipo: <strong style={{ textTransform: 'capitalize' }}>{importTipo}</strong></li>
                <li>Registros detectados: <strong>{importResult.total}</strong></li>
                <li>Registros válidos: <strong style={{ color: 'var(--color-success)' }}>{importResult.valid}</strong></li>
                <li>Registros con error: <strong style={{ color: 'var(--color-danger)' }}>{importResult.errors}</strong></li>
              </ul>
              
              <h5 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Columnas detectadas:</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {importResult.columnasDetectadas.map(col => (
                  <span key={col} style={{ backgroundColor: 'var(--color-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>{col}</span>
                ))}
              </div>

              {importResult.faltanObligatorias && (
                <p style={{ margin: 0, color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.25rem' }}></i>
                  Faltan columnas obligatorias. Verificá la plantilla.
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleSimularImportacion} disabled={!file || importing}>
              {importing && !importResult ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Simular'}
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirmarImportacion} disabled={!importResult || importing || importResult.faltanObligatorias}>
              {importing && importResult ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Confirmar'}
            </button>
            {file && (
              <button className="btn btn-outline" style={{ width: '100%', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => { setFile(null); setImportResult(null); }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* PANEL EXPORTAR */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="title-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-file-export" style={{ color: 'var(--color-success)' }}></i> Exportar Datos
          </h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Descargá la información en formato CSV para procesar en Excel u otras herramientas.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {exportOptions.map(opt => (
              <button 
                key={opt.id} 
                className="btn btn-outline" 
                style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0.75rem 1rem' }}
                onClick={() => handleExport(opt.id)}
              >
                <i className={`fa-solid ${opt.icon}`} style={{ width: '25px', color: 'var(--color-text-light)' }}></i>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FORMATO ESPERADO */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="title-md" style={{ margin: 0 }}>
            <i className="fa-solid fa-table-columns" style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }}></i> Formato esperado para importar socios
          </h2>
          <button className="btn btn-primary" onClick={handleDescargarPlantilla}>
            <i className="fa-solid fa-download" style={{ marginRight: '0.5rem' }}></i> Descargar plantilla Excel
          </button>
        </div>
        
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
          Al subir un archivo CSV/Excel de socios, el sistema espera encontrar (al menos) las siguientes columnas en la primera fila. 
          Las marcadas con un <span style={{ color: 'var(--color-danger)' }}>*</span> son obligatorias.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', backgroundColor: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          {columnasEsperadas.map(col => (
            <div key={col} style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: 'var(--color-white)', 
              border: `1px solid ${columnasObligatorias.includes(col) ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: columnasObligatorias.includes(col) ? 600 : 400
            }}>
              {col} {columnasObligatorias.includes(col) && <span style={{ color: 'var(--color-danger)' }}>*</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminImportExport;

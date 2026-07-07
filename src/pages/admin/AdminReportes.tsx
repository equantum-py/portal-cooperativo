import React, { useState } from 'react';
import { demoStore } from '../../services/demoStore';
import { useToast } from '../../context/ToastContext';

const AdminReportes: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || !rows.length) {
      showToast('No hay datos para exportar', 'warning');
      return;
    }
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(row => Object.values(row).map(v => `"${v}"`).join(','))
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
    }
  };

  const generateReport = (type: string) => {
    setLoading(type);
    // Simulate delay
    setTimeout(() => {
      let data: any[] = [];
      let filename = `reporte_${type}_${new Date().toISOString().split('T')[0]}`;
      
      try {
        if (type === 'socios_activos') {
          data = demoStore.getSocios().filter(s => s.estadoSocio === 'Activo').map(s => ({
            cedula: s.cedula,
            nombre: s.nombre,
            telefono: s.telefono,
            fechaIngreso: s.fechaIngreso
          }));
        } else if (type === 'socios_atrasados') {
          data = demoStore.getSocios().filter(s => s.estadoSocio === 'Atrasado').map(s => ({
            cedula: s.cedula,
            nombre: s.nombre,
            atrasosMonto: s.aportesAtrasadosMonto
          }));
        } else if (type === 'aportes_mes') {
          data = demoStore.getAllAportes().filter(a => a.estado === 'pagado');
        } else if (type === 'aportes_pendientes') {
          data = demoStore.getAllAportes().filter(a => a.estado !== 'pagado');
        } else if (type === 'prestamos_activos') {
          data = demoStore.getAllPrestamos().filter(p => p.estado === 'activo');
        } else if (type === 'cuotas_vencidas') {
          data = demoStore.getAllCuotasVencidas();
        } else if (type === 'pagos') {
          data = demoStore.getPagos();
        } else if (type === 'ahorros') {
          data = demoStore.getSocios().map(s => ({
            cedula: s.cedula,
            nombre: s.nombre,
            saldo: s.saldoDisponibleAhorro
          }));
        } else if (type === 'solicitudes_pendientes') {
          data = demoStore.getSolicitudes().filter(s => s.estado === 'pendiente');
        }

        if (data.length > 0) {
          exportToCSV(filename, data);
          showToast(`Reporte ${type} generado correctamente en modo demo.`, 'success');
        } else {
          showToast(`El reporte ${type} no contiene datos.`, 'warning');
        }
      } catch (err) {
        showToast(`Error al generar reporte en modo demo.`, 'error');
      }
      setLoading(null);
    }, 800);
  };

  const reportes = [
    { id: 'socios_activos', titulo: 'Socios Activos', desc: 'Listado completo de socios habilitados.', icon: 'fa-user-check' },
    { id: 'socios_atrasados', titulo: 'Socios Atrasados', desc: 'Padrón de socios en mora general.', icon: 'fa-user-minus' },
    { id: 'aportes_mes', titulo: 'Aportes del Mes', desc: 'Ingresos por aportes societarios.', icon: 'fa-hand-holding-dollar' },
    { id: 'aportes_pendientes', titulo: 'Aportes Pendientes', desc: 'Aportes emitidos no cobrados.', icon: 'fa-clock' },
    { id: 'prestamos_activos', titulo: 'Préstamos Activos', desc: 'Cartera de préstamos vigentes.', icon: 'fa-money-bill-transfer' },
    { id: 'cuotas_vencidas', titulo: 'Cuotas Vencidas', desc: 'Cuotas en mora por vencer.', icon: 'fa-triangle-exclamation' },
    { id: 'pagos', titulo: 'Pagos Registrados', desc: 'Historial global de pagos.', icon: 'fa-receipt' },
    { id: 'ahorros', titulo: 'Saldos de Ahorro', desc: 'Total ahorrado por socio.', icon: 'fa-vault' },
    { id: 'solicitudes_pendientes', titulo: 'Solicitudes Pendientes', desc: 'Nuevos socios y trámites en espera.', icon: 'fa-clipboard-list' }
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="title-lg" style={{ marginBottom: '0.25rem' }}>Centro de Reportes</h1>
        <p className="text-muted">Generación de informes gerenciales y financieros exportables.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {reportes.map(rep => (
          <div key={rep.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-info-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginRight: '1rem' }}>
                <i className={`fa-solid ${rep.icon}`}></i>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0' }}>{rep.titulo}</h3>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{rep.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>CSV Export</span>
              <button 
                className="btn btn-outline" 
                onClick={() => generateReport(rep.id)}
                disabled={loading === rep.id}
              >
                {loading === rep.id ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <><i className="fa-solid fa-download" style={{ marginRight: '0.5rem' }}></i> Generar</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReportes;

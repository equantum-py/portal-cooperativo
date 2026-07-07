export interface Notificacion {
  id: number;
  tipo: 'warning' | 'danger' | 'info' | 'success';
  titulo: string;
  mensaje: string;
  fecha: string;
}

export interface Movimiento {
  id: number;
  tipo: 'deposito' | 'retiro';
  concepto: string;
  monto: number;
  fecha: string;
}

export interface HistorialAporte {
  id: number;
  mes: string;
  monto: number;
  estado: 'pagado' | 'pendiente' | 'atrasado';
  fechaPago?: string;
}

export interface HistorialPrestamo {
  id: number;
  cuota: number;
  monto: number;
  vencimiento: string;
  estado: 'pagado' | 'pendiente' | 'vencido';
  fechaPago?: string;
}

export interface Socio {
  nombre: string;
  cedula: string;
  numeroSocio: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaIngreso: string;
  estadoSocio: string;
  aporteMensual: number;
  aportesAtrasadosMeses: number;
  aportesAtrasadosMonto: number;
  ultimoAportePagado: string;
  mesesPagadosAporte: number;
  mesesPendientesAporte: number;
  prestamoConcedido: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  cuotasVencidas: number;
  montoProximaCuota: number;
  fechaProximoVencimiento: string;
  totalAhorrado: number;
  saldoDisponibleAhorro: number;
  pagoPendiente: number;
  calificaPrestamoExpress: boolean;
  notificaciones: Notificacion[];
  movimientosAhorro: Movimiento[];
  historialAportes: HistorialAporte[];
  historialPrestamos: HistorialPrestamo[];
}

export const mockUser: Socio = {
  nombre: "Juan Pérez",
  cedula: "1234567",
  numeroSocio: "000245",
  telefono: "0981 123 456",
  email: "juan.perez@ejemplo.com",
  direccion: "Av. Mariscal López 1234, Asunción",
  fechaIngreso: "15/03/2018",
  estadoSocio: "Activo",
  
  // Resumen Financiero
  aporteMensual: 100000,
  aportesAtrasadosMeses: 2,
  aportesAtrasadosMonto: 200000,
  ultimoAportePagado: "15/05/2026",
  mesesPagadosAporte: 98,
  mesesPendientesAporte: 2,
  
  prestamoConcedido: 10000000,
  cuotasPagadas: 8,
  cuotasPendientes: 12,
  cuotasVencidas: 1,
  montoProximaCuota: 650000,
  fechaProximoVencimiento: "10/07/2026",
  
  totalAhorrado: 3500000,
  saldoDisponibleAhorro: 3500000,
  
  pagoPendiente: 850000, // 2 aportes + 1 cuota
  
  calificaPrestamoExpress: true,

  notificaciones: [
    { id: 1, tipo: 'warning', titulo: 'Cuota Vencida', mensaje: 'Tenés 1 cuota de préstamo vencida.', fecha: '01/07/2026' },
    { id: 2, tipo: 'danger', titulo: 'Aportes Atrasados', mensaje: 'Registrás 2 meses de atraso en tus aportes.', fecha: '16/06/2026' },
    { id: 3, tipo: 'info', titulo: 'Préstamo Express', mensaje: '¡Calificás para un préstamo express! Solicitalo desde la app.', fecha: '10/06/2026' }
  ],
  
  movimientosAhorro: [
    { id: 1, tipo: 'deposito', concepto: 'Depósito en Caja de Ahorro', monto: 500000, fecha: '01/06/2026' },
    { id: 2, tipo: 'retiro', concepto: 'Retiro en Cajero', monto: -200000, fecha: '15/05/2026' },
    { id: 3, tipo: 'deposito', concepto: 'Depósito por ventanilla', monto: 1000000, fecha: '10/04/2026' }
  ],

  historialAportes: [
    { id: 1, mes: 'Julio 2026', monto: 100000, estado: 'pendiente' },
    { id: 2, mes: 'Junio 2026', monto: 100000, estado: 'atrasado' },
    { id: 3, mes: 'Mayo 2026', monto: 100000, estado: 'pagado', fechaPago: '15/05/2026' },
    { id: 4, mes: 'Abril 2026', monto: 100000, estado: 'pagado', fechaPago: '10/04/2026' }
  ],

  historialPrestamos: [
    { id: 1, cuota: 10, monto: 650000, vencimiento: '10/08/2026', estado: 'pendiente' },
    { id: 2, cuota: 9, monto: 650000, vencimiento: '10/07/2026', estado: 'vencido' },
    { id: 3, cuota: 8, monto: 650000, vencimiento: '10/06/2026', estado: 'pagado', fechaPago: '08/06/2026' },
    { id: 4, cuota: 7, monto: 650000, vencimiento: '10/05/2026', estado: 'pagado', fechaPago: '09/05/2026' }
  ]
};

// Datos simulados para el panel de administración
export const mockAdminStats = {
  totalSocios: 1250,
  sociosActivos: 1180,
  sociosAtrasados: 70,
  prestamosActivos: 450,
  cuotasVencidasTotal: 85,
  pagosPendientesTotal: 154500000
};

export function formatCurrency(amount: number): string {
  return "Gs. " + amount.toLocaleString('es-PY');
}

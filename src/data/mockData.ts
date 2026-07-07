export interface Notificacion {
  id: number;
  tipo: 'warning' | 'danger' | 'info' | 'success';
  titulo: string;
  mensaje: string;
  fecha: string;
}

export interface Movimiento {
  id: number;
  tipo: 'deposito' | 'retiro' | 'interes';
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
  id: string;
  nombre: string;
  cedula: string;
  numeroSocio: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaIngreso: string;
  estadoSocio: 'Activo' | 'Inactivo' | 'Atrasado' | 'Pendiente';
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

export const mockSociosList: Socio[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    cedula: "1234567",
    numeroSocio: "000245",
    telefono: "0981 123 456",
    email: "juan.perez@ejemplo.com",
    direccion: "Av. Mariscal López 1234",
    fechaIngreso: "15/03/2018",
    estadoSocio: "Activo",
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
    pagoPendiente: 850000,
    calificaPrestamoExpress: true,
    notificaciones: [
      { id: 1, tipo: 'warning', titulo: 'Cuota Vencida', mensaje: 'Tenés 1 cuota de préstamo vencida.', fecha: '01/07/2026' }
    ],
    movimientosAhorro: [
      { id: 1, tipo: 'deposito', concepto: 'Depósito mensual', monto: 500000, fecha: '01/06/2026' }
    ],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "2",
    nombre: "María González",
    cedula: "7654321",
    numeroSocio: "000246",
    telefono: "0982 987 654",
    email: "maria.g@ejemplo.com",
    direccion: "Av. España 432",
    fechaIngreso: "10/01/2019",
    estadoSocio: "Activo",
    aporteMensual: 150000,
    aportesAtrasadosMeses: 0,
    aportesAtrasadosMonto: 0,
    ultimoAportePagado: "05/07/2026",
    mesesPagadosAporte: 80,
    mesesPendientesAporte: 0,
    prestamoConcedido: 0,
    cuotasPagadas: 0,
    cuotasPendientes: 0,
    cuotasVencidas: 0,
    montoProximaCuota: 0,
    fechaProximoVencimiento: "-",
    totalAhorrado: 12000000,
    saldoDisponibleAhorro: 12000000,
    pagoPendiente: 0,
    calificaPrestamoExpress: true,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "3",
    nombre: "Carlos Ayala",
    cedula: "4567890",
    numeroSocio: "000301",
    telefono: "0971 333 444",
    email: "carlos.ayala@ejemplo.com",
    direccion: "San Lorenzo",
    fechaIngreso: "20/05/2020",
    estadoSocio: "Atrasado",
    aporteMensual: 100000,
    aportesAtrasadosMeses: 4,
    aportesAtrasadosMonto: 400000,
    ultimoAportePagado: "15/03/2026",
    mesesPagadosAporte: 60,
    mesesPendientesAporte: 4,
    prestamoConcedido: 5000000,
    cuotasPagadas: 2,
    cuotasPendientes: 10,
    cuotasVencidas: 3,
    montoProximaCuota: 350000,
    fechaProximoVencimiento: "10/05/2026",
    totalAhorrado: 1500000,
    saldoDisponibleAhorro: 1500000,
    pagoPendiente: 1450000,
    calificaPrestamoExpress: false,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "4",
    nombre: "Laura Rojas",
    cedula: "2345678",
    numeroSocio: "000405",
    telefono: "0991 222 111",
    email: "laura.rojas@ejemplo.com",
    direccion: "Lambaré",
    fechaIngreso: "01/02/2021",
    estadoSocio: "Activo",
    aporteMensual: 200000,
    aportesAtrasadosMeses: 0,
    aportesAtrasadosMonto: 0,
    ultimoAportePagado: "02/07/2026",
    mesesPagadosAporte: 65,
    mesesPendientesAporte: 0,
    prestamoConcedido: 20000000,
    cuotasPagadas: 20,
    cuotasPendientes: 4,
    cuotasVencidas: 0,
    montoProximaCuota: 950000,
    fechaProximoVencimiento: "15/07/2026",
    totalAhorrado: 8500000,
    saldoDisponibleAhorro: 8500000,
    pagoPendiente: 0,
    calificaPrestamoExpress: true,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "5",
    nombre: "Roberto Ortiz",
    cedula: "5678901",
    numeroSocio: "000512",
    telefono: "0983 555 666",
    email: "roberto.o@ejemplo.com",
    direccion: "Fernando de la Mora",
    fechaIngreso: "10/08/2022",
    estadoSocio: "Inactivo",
    aporteMensual: 100000,
    aportesAtrasadosMeses: 12,
    aportesAtrasadosMonto: 1200000,
    ultimoAportePagado: "15/07/2025",
    mesesPagadosAporte: 10,
    mesesPendientesAporte: 12,
    prestamoConcedido: 0,
    cuotasPagadas: 0,
    cuotasPendientes: 0,
    cuotasVencidas: 0,
    montoProximaCuota: 0,
    fechaProximoVencimiento: "-",
    totalAhorrado: 500000,
    saldoDisponibleAhorro: 500000,
    pagoPendiente: 1200000,
    calificaPrestamoExpress: false,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "6",
    nombre: "Ana Martínez",
    cedula: "6789012",
    numeroSocio: "000620",
    telefono: "0972 888 999",
    email: "ana.martinez@ejemplo.com",
    direccion: "Luque",
    fechaIngreso: "05/11/2023",
    estadoSocio: "Activo",
    aporteMensual: 100000,
    aportesAtrasadosMeses: 0,
    aportesAtrasadosMonto: 0,
    ultimoAportePagado: "05/07/2026",
    mesesPagadosAporte: 32,
    mesesPendientesAporte: 0,
    prestamoConcedido: 2000000,
    cuotasPagadas: 5,
    cuotasPendientes: 7,
    cuotasVencidas: 0,
    montoProximaCuota: 180000,
    fechaProximoVencimiento: "05/08/2026",
    totalAhorrado: 2000000,
    saldoDisponibleAhorro: 2000000,
    pagoPendiente: 0,
    calificaPrestamoExpress: true,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "7",
    nombre: "Diego Franco",
    cedula: "8901234",
    numeroSocio: "000755",
    telefono: "0992 444 333",
    email: "diego.f@ejemplo.com",
    direccion: "Capiatá",
    fechaIngreso: "12/12/2024",
    estadoSocio: "Activo",
    aporteMensual: 150000,
    aportesAtrasadosMeses: 1,
    aportesAtrasadosMonto: 150000,
    ultimoAportePagado: "15/05/2026",
    mesesPagadosAporte: 18,
    mesesPendientesAporte: 1,
    prestamoConcedido: 0,
    cuotasPagadas: 0,
    cuotasPendientes: 0,
    cuotasVencidas: 0,
    montoProximaCuota: 0,
    fechaProximoVencimiento: "-",
    totalAhorrado: 1500000,
    saldoDisponibleAhorro: 1500000,
    pagoPendiente: 150000,
    calificaPrestamoExpress: true,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  },
  {
    id: "8",
    nombre: "Silvia Romero",
    cedula: "3456789",
    numeroSocio: "000888",
    telefono: "0981 777 888",
    email: "silvia.r@ejemplo.com",
    direccion: "Mariano Roque Alonso",
    fechaIngreso: "22/01/2025",
    estadoSocio: "Pendiente",
    aporteMensual: 100000,
    aportesAtrasadosMeses: 0,
    aportesAtrasadosMonto: 0,
    ultimoAportePagado: "-",
    mesesPagadosAporte: 0,
    mesesPendientesAporte: 0,
    prestamoConcedido: 0,
    cuotasPagadas: 0,
    cuotasPendientes: 0,
    cuotasVencidas: 0,
    montoProximaCuota: 0,
    fechaProximoVencimiento: "-",
    totalAhorrado: 0,
    saldoDisponibleAhorro: 0,
    pagoPendiente: 0,
    calificaPrestamoExpress: false,
    notificaciones: [],
    movimientosAhorro: [],
    historialAportes: [],
    historialPrestamos: []
  }
];

export const mockUser = mockSociosList[0];

export const mockFlujoCajaMensual = [
  { mes: 'Enero', ingresosAportes: 115000000, ingresosPrestamos: 240000000, otrosIngresos: 5000000, egresos: 180000000, saldoNeto: 180000000 },
  { mes: 'Febrero', ingresosAportes: 118000000, ingresosPrestamos: 245000000, otrosIngresos: 4000000, egresos: 195000000, saldoNeto: 172000000 },
  { mes: 'Marzo', ingresosAportes: 120000000, ingresosPrestamos: 250000000, otrosIngresos: 6000000, egresos: 200000000, saldoNeto: 176000000 },
  { mes: 'Abril', ingresosAportes: 122000000, ingresosPrestamos: 255000000, otrosIngresos: 4500000, egresos: 210000000, saldoNeto: 171500000 },
  { mes: 'Mayo', ingresosAportes: 125000000, ingresosPrestamos: 260000000, otrosIngresos: 7000000, egresos: 220000000, saldoNeto: 172000000 },
  { mes: 'Junio', ingresosAportes: 128000000, ingresosPrestamos: 265000000, otrosIngresos: 5500000, egresos: 230000000, saldoNeto: 168500000 }
];

export const mockAdminStats = {
  totalSocios: 1250,
  sociosActivos: 1180,
  sociosAtrasados: 70,
  aportesCobradosMes: 128000000,
  aportesPendientesMes: 15000000,
  prestamosActivos: 450,
  cuotasVencidasTotal: 85,
  totalPendienteCobro: 154500000,
  totalAhorradoSocios: 4500000000,
  ingresosMesActual: 398500000,
  egresosMesActual: 230000000,
  saldoCajaEstimado: 168500000
};

export function formatCurrency(amount: number): string {
  return "Gs. " + amount.toLocaleString('es-PY');
}

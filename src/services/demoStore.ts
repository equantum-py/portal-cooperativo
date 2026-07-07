import { mockSociosList, Socio, PagoAdmin, SolicitudAdmin, mockPagosList, mockSolicitudesList } from '../data/mockData';

const STORAGE_KEY = 'portal_cooperativo_socios';

export const demoStore = {
  getSocios: (): Socio[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSociosList));
    return mockSociosList;
  },

  saveSocios: (socios: Socio[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
  },

  addSocio: (socio: Omit<Socio, 'id'>) => {
    const socios = demoStore.getSocios();
    const newId = (socios.length + 1).toString() + Date.now().toString().slice(-4);
    const newSocio = { ...socio, id: newId };
    socios.push(newSocio);
    demoStore.saveSocios(socios);
    return newSocio;
  },

  updateSocio: (updatedSocio: Socio) => {
    const socios = demoStore.getSocios();
    const index = socios.findIndex(s => s.id === updatedSocio.id);
    if (index !== -1) {
      socios[index] = updatedSocio;
      demoStore.saveSocios(socios);
    }
  },

  toggleSocioStatus: (id: string, newStatus: Socio['estadoSocio']) => {
    const socios = demoStore.getSocios();
    const index = socios.findIndex(s => s.id === id);
    if (index !== -1) {
      socios[index].estadoSocio = newStatus;
      demoStore.saveSocios(socios);
    }
  },

  getAdminNotifications: (): any[] => {
    const stored = localStorage.getItem('portal_cooperativo_admin_notif');
    return stored ? JSON.parse(stored) : [];
  },

  sendNotification: (payload: { destinatario: string, tipo: any, titulo: string, mensaje: string, prioridad: string, canal: string }) => {
    const notifications = demoStore.getAdminNotifications();
    const newNotif = { id: Date.now(), fecha: new Date().toLocaleDateString('es-PY'), ...payload };
    notifications.unshift(newNotif);
    localStorage.setItem('portal_cooperativo_admin_notif', JSON.stringify(notifications));

    // Reflejar en el socio
    const socios = demoStore.getSocios();
    socios.forEach(socio => {
      let apply = false;
      if (payload.destinatario === 'todos') apply = true;
      if (payload.destinatario === 'atrasados' && socio.aportesAtrasadosMeses > 0) apply = true;
      if (payload.destinatario === 'activos' && socio.estadoSocio === 'Activo') apply = true;
      if (payload.destinatario === socio.id) apply = true;

      if (apply) {
        socio.notificaciones.unshift({
          id: Date.now() + Math.random(),
          tipo: payload.tipo,
          titulo: payload.titulo,
          mensaje: payload.mensaje,
          fecha: new Date().toLocaleDateString('es-PY')
        });
      }
    });
    demoStore.saveSocios(socios);
  },

  getAllAportes: () => {
    const socios = demoStore.getSocios();
    const all: any[] = [];
    socios.forEach(s => {
      s.historialAportes.forEach(a => {
        all.push({ ...a, socioId: s.id, socioNombre: s.nombre, cedula: s.cedula, numeroSocio: s.numeroSocio });
      });
    });
    return all.sort((a, b) => b.id - a.id);
  },

  getAllPrestamos: () => {
    const socios = demoStore.getSocios();
    const all: any[] = [];
    socios.forEach(s => {
      if (s.prestamoConcedido > 0) {
        all.push({
          socioId: s.id, socioNombre: s.nombre, cedula: s.cedula, 
          montoOtorgado: s.prestamoConcedido, 
          cuotas: s.cuotasPagadas + s.cuotasPendientes + s.cuotasVencidas,
          cuotasPagadas: s.cuotasPagadas,
          cuotasVencidas: s.cuotasVencidas,
          proximoVencimiento: s.fechaProximoVencimiento,
          estado: s.cuotasVencidas > 0 ? 'atrasado' : (s.cuotasPendientes > 0 ? 'activo' : 'cancelado'),
          historial: s.historialPrestamos
        });
      }
    });
    return all;
  },

  getAllCuotasVencidas: () => {
    const socios = demoStore.getSocios();
    const all: any[] = [];
    socios.forEach(s => {
      s.historialPrestamos.filter(p => p.estado === 'vencido').forEach(p => {
        all.push({ ...p, socioId: s.id, socioNombre: s.nombre, cedula: s.cedula, numeroSocio: s.numeroSocio });
      });
    });
    return all.sort((a, b) => b.id - a.id);
  },

  getPagos: (): PagoAdmin[] => {
    const data = localStorage.getItem('demoPagos');
    if (data) return JSON.parse(data);
    localStorage.setItem('demoPagos', JSON.stringify(mockPagosList));
    return mockPagosList;
  },

  savePagos: (pagos: PagoAdmin[]) => {
    localStorage.setItem('demoPagos', JSON.stringify(pagos));
  },

  getSolicitudes: (): SolicitudAdmin[] => {
    const data = localStorage.getItem('demoSolicitudes');
    if (data) return JSON.parse(data);
    localStorage.setItem('demoSolicitudes', JSON.stringify(mockSolicitudesList));
    return mockSolicitudesList;
  },

  saveSolicitudes: (solicitudes: SolicitudAdmin[]) => {
    localStorage.setItem('demoSolicitudes', JSON.stringify(solicitudes));
  },

  getConfiguracion: () => {
    const data = localStorage.getItem('demoConfiguracion');
    if (data) return JSON.parse(data);
    const defaultConfig = {
      nombreCooperativa: 'Cooperativa Equantum Ltda.',
      nombrePortal: 'Portal Equantum',
      telefono: '021 123 4567',
      email: 'contacto@equantum.com.py',
      whatsapp: '0981 123 456',
      direccion: 'Av. Mariscal López 1234',
      ciudad: 'Asunción',
      montoAporteDefecto: 100000,
      diaVencimientoAporte: 10,
      moneda: 'Gs.',
      interesDemo: 20,
      maxCuotas: 36,
      nombreAdmin: 'Administrador Principal'
    };
    localStorage.setItem('demoConfiguracion', JSON.stringify(defaultConfig));
    return defaultConfig;
  },

  saveConfiguracion: (config: any) => {
    localStorage.setItem('demoConfiguracion', JSON.stringify(config));
  },

  getPlantillas: () => {
    const data = localStorage.getItem('demoPlantillas');
    if (data) return JSON.parse(data);
    const defaultTemplates = [
      { id: 'aporte_mensual', nombre: 'Aviso de aporte mensual', titulo: 'Recordatorio de Aporte', mensaje: 'Recordá que tu aporte de este mes vence pronto.', tipo: 'info' },
      { id: 'aporte_atrasado', nombre: 'Aviso de aporte atrasado', titulo: 'Aporte Atrasado', mensaje: 'Tenés aportes pendientes. Regularizá tu situación.', tipo: 'danger' },
      { id: 'prestamo_vencido', nombre: 'Aviso de préstamo vencido', titulo: 'Próximo Vencimiento', mensaje: 'Tu cuota de préstamo vence en breve.', tipo: 'warning' },
      { id: 'mora', nombre: 'Aviso de mora', titulo: 'Aviso de Mora', mensaje: 'Tu préstamo registra mora. Evitá recargos pagando a tiempo.', tipo: 'danger' },
      { id: 'oferta_prestamo', nombre: 'Oferta de préstamo', titulo: '¡Préstamo Pre-aprobado!', mensaje: 'Calificás para un préstamo express con tasas preferenciales.', tipo: 'success' },
      { id: 'reunion', nombre: 'Reunión de socios', titulo: 'Asamblea Ordinaria', mensaje: 'Te invitamos a la próxima asamblea de socios.', tipo: 'info' },
      { id: 'general', nombre: 'Aviso general', titulo: 'Aviso Institucional', mensaje: 'Comunicado general para todos los socios de la cooperativa.', tipo: 'info' }
    ];
    localStorage.setItem('demoPlantillas', JSON.stringify(defaultTemplates));
    return defaultTemplates;
  },

  savePlantillas: (plantillas: any[]) => {
    localStorage.setItem('demoPlantillas', JSON.stringify(plantillas));
  }
};

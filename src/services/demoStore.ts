import { mockSociosList, Socio } from '../data/mockData';

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
  }
};

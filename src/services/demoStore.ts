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
  }
};

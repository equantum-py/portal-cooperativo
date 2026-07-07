import { appConfig } from '../config/appConfig';

// Simula un retardo de red
export const delay = (ms: number = appConfig.simularRetardoAPI) =>
  new Promise(resolve => setTimeout(resolve, ms));

export interface UserSession {
  cedula: string;
  nombre: string;
  token: string;
  rol: 'socio' | 'admin';
}

export const authService = {
  async login(cedula: string, password: string): Promise<UserSession> {
    await delay();

    // Por ahora el login es simulado.
    // Usamos password para evitar error de TypeScript y dejar preparada la lógica futura.
    if (!password.trim()) {
      throw new Error('Ingresá tu contraseña');
    }

    // Validación de prueba estática. En producción esto irá al backend.
    if (cedula === '1234567') {
      const session: UserSession = {
        cedula,
        nombre: 'Juan Pérez',
        token: 'fake-jwt-token-socio',
        rol: 'socio'
      };

      localStorage.setItem('userSession', JSON.stringify(session));
      return session;
    }

    if (cedula === 'admin') {
      const session: UserSession = {
        cedula,
        nombre: 'Administrador Principal',
        token: 'fake-jwt-token-admin',
        rol: 'admin'
      };

      localStorage.setItem('userSession', JSON.stringify(session));
      return session;
    }

    throw new Error('Cédula o contraseña incorrecta');
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('userSession');
  },

  getSession(): UserSession | null {
    const data = localStorage.getItem('userSession');

    if (data) {
      try {
        return JSON.parse(data) as UserSession;
      } catch {
        return null;
      }
    }

    return null;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
};

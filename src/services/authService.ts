import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const delay = (ms: number = appConfig.simularRetardoAPI) => 
  new Promise(resolve => setTimeout(resolve, ms));

export interface UserSession {
  cedula: string;
  nombre: string;
  token: string;
  rol: 'socio' | 'admin';
}

export const authService = {
  async loginSocio(cedula: string): Promise<UserSession> {
    // Limpiamos cualquier sesión anterior
    localStorage.removeItem('userSession');

    if (appConfig.modoDemo) {
      await delay();
      if (cedula === '1234567') {
        const session: UserSession = { cedula, nombre: 'Juan Pérez', token: 'fake-jwt-token-socio', rol: 'socio' };
        localStorage.setItem('userSession', JSON.stringify(session));
        return session;
      }
      throw new Error('No encontramos un socio con esa cédula.');
    } else {
      // Implementación Real (PostgreSQL)
      throw new Error('Conexión a base de datos requerida para login sin contraseña.');
    }
  },

  async loginAdmin(usuario: string, pin: string): Promise<UserSession> {
    // Limpiamos cualquier sesión anterior
    localStorage.removeItem('userSession');

    if (appConfig.modoDemo) {
      await delay();
      if (usuario === 'admin' && pin === '1234') {
        const session: UserSession = { cedula: usuario, nombre: 'Administrador Principal', token: 'fake-jwt-token-admin', rol: 'admin' };
        localStorage.setItem('userSession', JSON.stringify(session));
        return session;
      }
      throw new Error('Usuario o PIN incorrecto');
    } else {
      // Implementación Real con Supabase
      if (!supabase) throw new Error('Supabase no está configurado');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${usuario}@portalcooperativo.local`, // o usar custom auth
        password: pin,
      });

      if (error) throw new Error(error.message);

      // Obtener datos del perfil desde la tabla socios
      const { data: profileData, error: profileError } = await supabase
        .from('socios')
        .select('cedula, nombre_completo, rol')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profileData) throw new Error('Error al obtener perfil del admin');

      const session: UserSession = {
        cedula: profileData.cedula,
        nombre: profileData.nombre_completo,
        token: data.session.access_token,
        rol: profileData.rol as 'socio' | 'admin'
      };
      
      localStorage.setItem('userSession', JSON.stringify(session));
      return session;
    }
  },

  async logout(): Promise<void> {
    if (appConfig.modoDemo) {
      await delay(100);
      localStorage.removeItem('userSession');
    } else {
      if (!supabase) throw new Error('Supabase no está configurado');
      await supabase.auth.signOut();
      localStorage.removeItem('userSession');
    }
  },

  getSession(): UserSession | null {
    const data = localStorage.getItem('userSession');
    if (data) {
      try {
        return JSON.parse(data) as UserSession;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
};

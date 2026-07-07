import { appConfig } from '../config/appConfig';
import { requireSupabase, supabase } from '../lib/supabaseClient';

export const delay = (ms: number = appConfig.simularRetardoAPI) => 
  new Promise(resolve => setTimeout(resolve, ms));

export interface UserSession {
  cedula: string;
  nombre: string;
  token: string;
  rol: 'socio' | 'admin';
  email?: string;
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
      const client = requireSupabase();
      const { data, error } = await client.auth.signInWithPassword({
        email: usuario,
        password: pin,
      });

      if (error) throw new Error(error.message);
      if (!data.user || !data.session) throw new Error('No se pudo iniciar sesión administrativa.');

      const { data: profileData, error: profileError } = await client
        .from('admin_profiles')
        .select('nombre, email, rol, activo')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (profileError) {
        await client.auth.signOut();
        localStorage.removeItem('userSession');
        throw new Error('No se pudo validar el perfil administrativo.');
      }

      if (!profileData || profileData.activo !== true) {
        await client.auth.signOut();
        localStorage.removeItem('userSession');
        throw new Error('Tu usuario no tiene un perfil administrativo activo.');
      }

      const email = profileData.email || data.user.email || usuario;
      const session: UserSession = {
        cedula: email,
        nombre: profileData.nombre || email,
        token: data.session.access_token,
        rol: 'admin',
        email,
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
  },

  isSocio(): boolean {
    return this.getSession()?.rol === 'socio';
  },

  isAdmin(): boolean {
    return this.getSession()?.rol === 'admin';
  }
};

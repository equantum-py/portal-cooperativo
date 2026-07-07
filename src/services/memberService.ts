import { delay } from './authService';
import { mockUser, Socio } from '../data/mockData';
import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const memberService = {
  async getProfile(): Promise<Socio> {
    if (appConfig.modoDemo) {
      await delay();
      return mockUser;
    } else {
      // Implementación Real con Supabase
      const { data, error } = await supabase
        .from('socios')
        .select(`
          *,
          aportes(*),
          prestamos(*),
          ahorros(*),
          notificaciones(*)
        `)
        .single();

      if (error) throw error;
      return data as unknown as Socio; // Requiere adaptar los tipos a la BD real luego
    }
  },

  async getAportes(): Promise<{
    aporteMensual: number;
    aportesAtrasadosMeses: number;
    aportesAtrasadosMonto: number;
    mesesPagadosAporte: number;
    mesesPendientesAporte: number;
  }> {
    if (appConfig.modoDemo) {
      await delay();
      return {
        aporteMensual: mockUser.aporteMensual,
        aportesAtrasadosMeses: mockUser.aportesAtrasadosMeses,
        aportesAtrasadosMonto: mockUser.aportesAtrasadosMonto,
        mesesPagadosAporte: mockUser.mesesPagadosAporte,
        mesesPendientesAporte: mockUser.mesesPendientesAporte
      };
    } else {
      // Implementación Real con Supabase
      const { data: socioData, error: socioError } = await supabase.from('socios').select('aporte_mensual_acordado').single();
      if (socioError) throw socioError;

      const { data: aportesData, error: aportesError } = await supabase.from('aportes').select('*');
      if (aportesError) throw aportesError;

      // Cálculo de atrasos (simplificado)
      const atrasados = aportesData.filter(a => a.estado === 'atrasado');
      const pagados = aportesData.filter(a => a.estado === 'pagado');

      return {
        aporteMensual: socioData.aporte_mensual_acordado,
        aportesAtrasadosMeses: atrasados.length,
        aportesAtrasadosMonto: atrasados.reduce((sum, a) => sum + a.monto, 0),
        mesesPagadosAporte: pagados.length,
        mesesPendientesAporte: aportesData.filter(a => a.estado === 'pendiente').length
      };
    }
  }
};

import { delay } from './authService';
import { mockAdminStats } from '../data/mockData';
import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const adminService = {
  async getDashboardStats(): Promise<typeof mockAdminStats> {
    if (appConfig.modoDemo) {
      await delay();
      return mockAdminStats;
    } else {
      // Implementación Real con Supabase (Ejemplo de múltiples queries)
      if (!supabase) throw new Error('Supabase no está configurado');
      const { count: totalSocios } = await supabase.from('socios').select('*', { count: 'exact', head: true });
      const { count: sociosActivos } = await supabase.from('socios').select('*', { count: 'exact', head: true }).eq('estado', 'activo');
      const { count: prestamosActivos } = await supabase.from('prestamos').select('*', { count: 'exact', head: true }).eq('estado', 'activo');
      const { count: cuotasVencidas } = await supabase.from('cuotas_prestamo').select('*', { count: 'exact', head: true }).eq('estado', 'vencida');
      
      // En una BD real esto se haría idealmente con una View o RPC para mejor rendimiento
      const { data: pagos } = await supabase.from('pagos').select('monto_total').eq('estado', 'pendiente');
      const pagosPendientesTotal = (pagos || []).reduce((sum, p) => sum + p.monto_total, 0);

      return {
        totalSocios: totalSocios || 0,
        sociosActivos: sociosActivos || 0,
        sociosAtrasados: 0, // Simplificado para este ejemplo
        prestamosActivos: prestamosActivos || 0,
        cuotasVencidasTotal: cuotasVencidas || 0,
        pagosPendientesTotal: pagosPendientesTotal
      };
    }
  }
};

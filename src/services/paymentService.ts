import { delay } from './authService';
import { mockUser } from '../data/mockData';
import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const paymentService = {
  async getPendingPayments(): Promise<{
    totalPendiente: number;
    fechaVencimiento: string;
  }> {
    if (appConfig.modoDemo) {
      await delay();
      return {
        totalPendiente: mockUser.pagoPendiente,
        fechaVencimiento: mockUser.fechaProximoVencimiento
      };
    } else {
      // Implementación Real con Supabase
      if (!supabase) throw new Error('Supabase no está configurado');
      const { data: pagos, error } = await supabase.from('pagos').select('*').eq('estado', 'pendiente');
      if (error) throw error;
      
      const total = pagos.reduce((sum, p) => sum + p.monto_total, 0);
      return {
        totalPendiente: total,
        fechaVencimiento: pagos.length > 0 ? pagos[0].fecha_pago : '-' // Simplificado
      };
    }
  }
};

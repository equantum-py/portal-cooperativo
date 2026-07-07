import { delay } from './authService';
import { mockUser } from '../data/mockData';
import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const loanService = {
  async getLoanDetails(): Promise<{
    prestamoConcedido: number;
    cuotasPagadas: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    montoProximaCuota: number;
    fechaProximoVencimiento: string;
  }> {
    if (appConfig.modoDemo) {
      await delay();
      return {
        prestamoConcedido: mockUser.prestamoConcedido,
        cuotasPagadas: mockUser.cuotasPagadas,
        cuotasPendientes: mockUser.cuotasPendientes,
        cuotasVencidas: mockUser.cuotasVencidas,
        montoProximaCuota: mockUser.montoProximaCuota,
        fechaProximoVencimiento: mockUser.fechaProximoVencimiento
      };
    } else {
      // Implementación Real con Supabase
      if (!supabase) throw new Error('Supabase no está configurado');
      const { data: prestamo, error: prestamoError } = await supabase
        .from('prestamos')
        .select('*')
        .eq('estado', 'activo')
        .single();
      
      if (prestamoError && prestamoError.code !== 'PGRST116') throw prestamoError;
      if (!prestamo) return { prestamoConcedido: 0, cuotasPagadas: 0, cuotasPendientes: 0, cuotasVencidas: 0, montoProximaCuota: 0, fechaProximoVencimiento: '-' };

      const { data: cuotas, error: cuotasError } = await supabase.from('cuotas_prestamo').select('*').eq('prestamo_id', prestamo.id);
      if (cuotasError) throw cuotasError;

      const pagadas = cuotas.filter(c => c.estado === 'pagada');
      const pendientes = cuotas.filter(c => c.estado === 'pendiente');
      const vencidas = cuotas.filter(c => c.estado === 'vencida');
      
      const proximaCuota = pendientes.sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime())[0];

      return {
        prestamoConcedido: prestamo.monto_concedido,
        cuotasPagadas: pagadas.length,
        cuotasPendientes: pendientes.length,
        cuotasVencidas: vencidas.length,
        montoProximaCuota: proximaCuota ? proximaCuota.monto_cuota : 0,
        fechaProximoVencimiento: proximaCuota ? proximaCuota.fecha_vencimiento : '-'
      };
    }
  },

  async checkExpressEligibility(): Promise<{
    califica: boolean;
    motivo: string;
  }> {
    if (appConfig.modoDemo) {
      await delay();
      return {
        califica: mockUser.calificaPrestamoExpress,
        motivo: mockUser.calificaPrestamoExpress ? 'Cumple con los requisitos' : 'Registra atrasos en aportes'
      };
    } else {
      // Lógica de calificación real validando atrasos en BD
      if (!supabase) throw new Error('Supabase no está configurado');
      const { count: atrasos } = await supabase.from('aportes').select('*', { count: 'exact', head: true }).eq('estado', 'atrasado');
      const califica = (atrasos || 0) === 0;
      return {
        califica,
        motivo: califica ? 'Cumple con los requisitos' : 'Registra atrasos en aportes'
      };
    }
  }
};

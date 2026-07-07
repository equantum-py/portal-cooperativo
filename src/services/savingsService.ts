import { delay } from './authService';
import { mockUser, Movimiento } from '../data/mockData';
import { appConfig } from '../config/appConfig';
import { supabase } from '../lib/supabaseClient';

export const savingsService = {
  async getSavingsSummary(): Promise<{
    totalAhorrado: number;
    saldoDisponible: number;
  }> {
    if (appConfig.modoDemo) {
      await delay();
      return {
        totalAhorrado: mockUser.totalAhorrado,
        saldoDisponible: mockUser.saldoDisponibleAhorro
      };
    } else {
      // Implementación Real con Supabase
      if (!supabase) throw new Error('Supabase no está configurado');
      const { data, error } = await supabase.from('ahorros').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      
      return {
        totalAhorrado: data ? data.saldo_total : 0,
        saldoDisponible: data ? data.saldo_disponible : 0
      };
    }
  },

  async getRecentMovements(): Promise<Movimiento[]> {
    if (appConfig.modoDemo) {
      await delay();
      return mockUser.movimientosAhorro;
    } else {
      // Implementación Real con Supabase
      if (!supabase) throw new Error('Supabase no está configurado');
      const { data: ahorro, error: ahorroError } = await supabase.from('ahorros').select('id').single();
      if (ahorroError || !ahorro) return [];

      const { data, error } = await supabase.from('movimientos_ahorro').select('*').eq('ahorro_id', ahorro.id).order('fecha_movimiento', { ascending: false });
      if (error) throw error;
      
      return data.map(d => ({
        id: d.id,
        tipo: d.tipo as 'deposito' | 'retiro',
        concepto: d.concepto,
        monto: d.monto,
        fecha: new Date(d.fecha_movimiento).toLocaleDateString()
      }));
    }
  }
};

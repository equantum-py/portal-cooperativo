import { delay } from './authService';
import { mockUser, Movimiento } from '../data/mockData';

export const savingsService = {
  async getSavingsSummary(): Promise<{
    totalAhorrado: number;
    saldoDisponible: number;
  }> {
    await delay();
    return {
      totalAhorrado: mockUser.totalAhorrado,
      saldoDisponible: mockUser.saldoDisponibleAhorro
    };
  },

  async getRecentMovements(): Promise<Movimiento[]> {
    await delay();
    return mockUser.movimientosAhorro;
  }
};

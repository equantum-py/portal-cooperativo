import { delay } from './authService';
import { mockUser } from '../data/mockData';

export const loanService = {
  async getLoanDetails(): Promise<{
    prestamoConcedido: number;
    cuotasPagadas: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    montoProximaCuota: number;
    fechaProximoVencimiento: string;
  }> {
    await delay();
    return {
      prestamoConcedido: mockUser.prestamoConcedido,
      cuotasPagadas: mockUser.cuotasPagadas,
      cuotasPendientes: mockUser.cuotasPendientes,
      cuotasVencidas: mockUser.cuotasVencidas,
      montoProximaCuota: mockUser.montoProximaCuota,
      fechaProximoVencimiento: mockUser.fechaProximoVencimiento
    };
  },

  async checkExpressEligibility(): Promise<{
    califica: boolean;
    motivo: string;
  }> {
    await delay();
    return {
      califica: mockUser.calificaPrestamoExpress,
      motivo: mockUser.calificaPrestamoExpress ? 'Cumple con los requisitos' : 'Registra atrasos en aportes'
    };
  }
};

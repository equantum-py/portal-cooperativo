import { delay } from './authService';
import { mockUser } from '../data/mockData';

export const paymentService = {
  async getPendingPayments(): Promise<{
    totalPendiente: number;
    fechaVencimiento: string;
  }> {
    await delay();
    return {
      totalPendiente: mockUser.pagoPendiente,
      fechaVencimiento: mockUser.fechaProximoVencimiento
    };
  }
};

import { delay } from './authService';
import { mockUser, Socio } from '../data/mockData';

export const memberService = {
  async getProfile(): Promise<Socio> {
    await delay();
    return mockUser;
  },

  async getAportes(): Promise<{
    aporteMensual: number;
    aportesAtrasadosMeses: number;
    aportesAtrasadosMonto: number;
    mesesPagadosAporte: number;
    mesesPendientesAporte: number;
  }> {
    await delay();
    return {
      aporteMensual: mockUser.aporteMensual,
      aportesAtrasadosMeses: mockUser.aportesAtrasadosMeses,
      aportesAtrasadosMonto: mockUser.aportesAtrasadosMonto,
      mesesPagadosAporte: mockUser.mesesPagadosAporte,
      mesesPendientesAporte: mockUser.mesesPendientesAporte
    };
  }
};

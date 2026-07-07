import { delay } from './authService';
import { mockAdminStats } from '../data/mockData';

export const adminService = {
  async getDashboardStats(): Promise<typeof mockAdminStats> {
    await delay();
    return mockAdminStats;
  }
};

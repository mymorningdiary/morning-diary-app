import { AppVersion } from '@/core/types';
import { ApiResponse } from '../types';
import apiClient from '../axios';

const appAPI = {
  getAppVersion: async (): Promise<ApiResponse<AppVersion>> => {
    const response = await apiClient.get('/app-version');
    return response.data;
  },
};

export default appAPI;

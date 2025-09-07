import { AppVersion } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';

const appAPI = {
  getAppVersion: async (): Promise<ApiResponse<AppVersion>> => {
    const response = await apiClient.get('/app-version');
    return response.data;
  },
};

export default appAPI;

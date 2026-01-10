import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { AppVersion } from '../types/versions';

export const getAppVersion = async (): Promise<ApiResponse<AppVersion>> => {
  const response = await instance.get('/app-version');
  return response.data;
};

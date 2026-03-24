import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export const postLogout = async (): Promise<ApiResponse<null>> => {
  const response = await authInstance.post('/auth/logout');
  return response.data;
};

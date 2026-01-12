import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { User } from '../model/types';

export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  const response = await authInstance.get('/users/info');
  return response.data;
};

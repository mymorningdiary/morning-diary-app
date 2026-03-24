import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export const patchUsersStatus = async (): Promise<ApiResponse<null>> => {
  const response = await authInstance.patch('/users/status');
  return response.data;
};

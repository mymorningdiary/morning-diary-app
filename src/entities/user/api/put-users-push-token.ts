import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface PutUsersPushTokenRequest {
  pushToken: string | null;
}

export const putUsersPushToken = async (
  body: PutUsersPushTokenRequest,
): Promise<ApiResponse<null>> => {
  const response = await authInstance.put('/users/push-token', body);
  return response.data;
};

import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface PutUsersAlarmTimeRequest {
  alarmTime: string;
}

export const putUsersAlarmTime = async (
  body: PutUsersAlarmTimeRequest,
): Promise<ApiResponse<null>> => {
  const response = await authInstance.put('/users/alarm-time', body);
  return response.data;
};

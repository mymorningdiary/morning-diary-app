import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface PutUsersTextGoalRequest {
  textGoalId: number;
}

export const putUsersTextGoal = async (
  body: PutUsersTextGoalRequest,
): Promise<ApiResponse<null>> => {
  const response = await authInstance.put('/users/text-goal', body);
  return response.data;
};

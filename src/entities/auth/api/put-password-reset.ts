import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface PasswordResetParams {
  passwordResetToken: string;
}

export const putPasswordReset = async ({
  passwordResetToken,
}: PasswordResetParams): Promise<ApiResponse<null>> => {
  const response = await instance.put('/auth/password/reset', null, {
    headers: { Authorization: `Bearer ${passwordResetToken}` },
  });

  return response.data;
};

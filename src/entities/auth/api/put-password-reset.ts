import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface PasswordResetRequest {
  newPassword: string;
}

interface PasswordResetParams {
  passwordResetToken: string;
}

export const putPasswordReset = async ({
  params,
  body,
}: {
  params: PasswordResetParams;
  body: PasswordResetRequest;
}): Promise<ApiResponse<null>> => {
  const response = await instance.put('/auth/password/reset', body, {
    headers: { Authorization: `Bearer ${params.passwordResetToken}` },
  });

  return response.data;
};

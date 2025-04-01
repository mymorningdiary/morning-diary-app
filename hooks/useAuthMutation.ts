import { authApi } from '@/core/api/auth';
import { ApiErrorResponse } from '@/core/api/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useLoginWithKakao = () => {
  const { mutate } = useMutation({
    mutationFn: authApi.loginWithKakao,
  });

  return { mutate };
};

export const useAutoLogin = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: authApi.autoLogin,
    onSuccess: (data) => {
      console.log('[Auth Mutation] Auto login success:', data);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Auth Mutation] Auto login error:', error.response?.data);
    },
  });

  return { mutate, isPending, data };
};

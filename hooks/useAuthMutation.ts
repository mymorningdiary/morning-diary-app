import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/core/api';

import { ApiErrorResponse } from '@/core/api/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useLoginWithKakao = () => {
  const { saveAccessToken } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: authAPI.loginWithKakao,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          await saveAccessToken(response.data.token);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Auth Mutation] Login with Kakao error:', error.response?.data);
    },
  });

  return { mutate, isPending };
};

export const useAutoLogin = () => {
  const { saveAccessToken } = useAuth();

  const { mutate, isPending, data } = useMutation({
    mutationFn: authAPI.autoLogin,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          await saveAccessToken(response.data.token);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Auth Mutation] Auto login error:', error.response?.data);
    },
  });

  return { mutate, isPending, data };
};

import { useAuth } from '@/contexts/AuthContext3';
import { authAPI } from '@/core/api';

import { ApiError } from '@/core/api/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useAutoLogin = () => {
  const { login } = useAuth();

  const { mutate, isPending, data } = useMutation({
    mutationFn: authAPI.autoLogin,
    onSuccess: (response) => {
      switch (response.code) {
        case 2000:
          login(response.data.token);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error('[Auth Mutation] Auto login error:', error.response?.data);
    },
  });

  return { mutate, isPending, data };
};

import { useAuth } from '@/contexts/AuthContext3';
import { authAPI } from '@/core/api';

import { ApiError } from '@/core/api/types';
import { Auth } from '@/core/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

export const useLoginWithKakao = () => {
  const [auth, setAuth] = useState<Auth | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: authAPI.loginWithKakao,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          setAuth(response.data);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error('[Auth Mutation] Login with Kakao error:', error.response?.data);
    },
  });

  return { mutate, auth, isPending };
};

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

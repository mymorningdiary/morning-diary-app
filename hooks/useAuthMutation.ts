import { authApi } from '@/core/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useLoginWithKakao = () => {
  const { mutate } = useMutation({
    mutationFn: authApi.loginWithKakao,
  });

  return { mutate };
};

export const useAutoLogin = () => {
  const { mutate } = useMutation({
    mutationFn: authApi.autoLogin,
  });

  return { mutate };
};

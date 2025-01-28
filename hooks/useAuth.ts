import { useApiMutation } from './useApi';
import { Auth } from '@/core/api';

export const useAuth = () => {
  const {
    mutate: loginWithKakao,
    data: loginResponse,
    isPending: isLoginLoading,
    error: loginError,
  } = useApiMutation<Auth.PostKakaoLoginResponse, Auth.PostKakaoLoginRequest>({
    path: '/auth/kakao/login',
  });

  return { loginWithKakao, loginResponse, isLoginLoading, loginError };
};

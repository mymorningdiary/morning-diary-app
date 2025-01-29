import { useEffect, useState } from 'react';
import { useApiMutation } from './useApi';
import { SessionManager } from '@/core/storage';
import { Auth } from '@/core/api';
import { Nullable } from '@/types';

export const useAuth = () => {
  const {
    mutate: loginWithKakao,
    data: loginResponse,
    isPending: isLoginLoading,
    error: loginError,
  } = useApiMutation<Auth.PostKakaoLoginRequest, Auth.PostKakaoLoginResponse>({
    path: '/auth/kakao/login',
  });

  const [isExistUser, setIsExistUser] = useState<Nullable<boolean>>(null);

  useEffect(() => {
    const { code, data } = loginResponse ?? {};

    console.log(loginResponse);

    if (code === 2000 && data !== undefined) {
      SessionManager.setSessionInfo({ accessToken: data.token });
      setIsExistUser(data.isExistUser);
    }
  }, [loginResponse]);

  return { loginWithKakao, isLoginLoading, loginError, isExistUser };
};

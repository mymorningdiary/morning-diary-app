import { setLogoutCallback } from '@/core/api/axios';
import { authManager } from '@/core/storage';
import { Nullable } from '@/types';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: Nullable<boolean>;
  saveAccessToken: (accessToken: string) => Promise<boolean>;
  removeAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  saveAccessToken: () => Promise.resolve(false),
  removeAccessToken: () => Promise.resolve(false),
  logout: () => Promise.resolve(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<Nullable<boolean>>(null);

  useEffect(() => {
    if (__DEV__) {
      console.log('[Auth State] Login status changed:', isLoggedIn);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const checkAccessToken = async () => {
      const hasAccessToken = await authManager.hasAccessToken();
      setIsLoggedIn(hasAccessToken);
    };

    checkAccessToken();
  }, []);

  const saveAccessToken = async (accessToken: string) => {
    try {
      await authManager.saveAccessToken(accessToken);
      setIsLoggedIn(true);

      return true;
    } catch (error) {
      console.error('Failed to update token', error);

      return false;
    }
  };

  const removeAccessToken = async () => {
    try {
      await authManager.removeAccessToken();
      setIsLoggedIn(false);

      return true;
    } catch (error) {
      console.error('Failed to remove token', error);

      return false;
    }
  };

  const logout = async () => {
    try {
      await authManager.removeAccessToken();
      setIsLoggedIn(false);

      // 로그아웃 시 네비게이션 처리
      router.dismissAll();
      router.replace('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  useEffect(() => {
    setLogoutCallback(async () => {
      await logout();
    });
  });

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        saveAccessToken,
        removeAccessToken,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { isLoggedIn, saveAccessToken, removeAccessToken, logout } = useContext(AuthContext);
  return { isLoggedIn, saveAccessToken, removeAccessToken, logout };
};

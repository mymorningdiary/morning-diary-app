import { authManager } from '@/core/storage';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: Nullable<boolean>;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  login: () => Promise.resolve(),
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

  const login = async (accessToken: string) => {
    try {
      await authManager.saveAccessToken(accessToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to update token', error);
    }
  };

  const logout = async () => {
    try {
      await authManager.removeAccessToken();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  return { isLoggedIn, login, logout };
};

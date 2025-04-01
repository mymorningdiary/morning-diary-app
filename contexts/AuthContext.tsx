import { authManager } from '@/core/storage';
import { useAutoLogin } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  saveAuthTokens: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<boolean>;
  removeAuthTokens: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  saveAuthTokens: () => Promise.resolve(false),
  removeAuthTokens: () => Promise.resolve(false),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    mutate: autoLogin,
    isPending: isAutoLoginPending,
    data: autoLoginResponse,
  } = useAutoLogin();

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (__DEV__) {
      console.log('[Auth] Login status changed:', isLoggedIn);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (autoLoginResponse) {
    }
  }, [autoLoginResponse]);

  useEffect(() => {
    const checkHasAccessToken = async () => {
      const hasAccessToken = await authManager.hasAccessToken();
      setIsLoggedIn(hasAccessToken);
    };

    checkHasAccessToken();
  }, []);

  const handleSaveAuthTokens = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    try {
      await authManager.setTokens({ accessToken, refreshToken });
      setIsLoggedIn(true);

      return true;
    } catch (error) {
      console.error('Failed to update token', error);

      return false;
    }
  };

  const handleRemoveAuthTokens = async () => {
    try {
      await authManager.clearTokens();
      setIsLoggedIn(false);

      return true;
    } catch (error) {
      console.error('Failed to remove token', error);

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        saveAuthTokens: handleSaveAuthTokens,
        removeAuthTokens: handleRemoveAuthTokens,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { isLoggedIn, saveAuthTokens, removeAuthTokens } = useContext(AuthContext);
  return { isLoggedIn, saveAuthTokens, removeAuthTokens };
};

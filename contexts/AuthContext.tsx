import { authManager } from '@/core/storage';
import { useAutoLogin } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  saveAccessToken: (accessToken: string) => Promise<boolean>;
  removeAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  saveAccessToken: () => Promise.resolve(false),
  removeAccessToken: () => Promise.resolve(false),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      console.log('[Auth] Login status changed:', isLoggedIn);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const checkHasAccessToken = async () => {
      const hasAccessToken = await authManager.hasAccessToken();
      setIsLoggedIn(hasAccessToken);
    };

    checkHasAccessToken();
  }, []);

  const handleSaveAccessToken = async (accessToken: string) => {
    try {
      await authManager.saveAccessToken(accessToken);
      setIsLoggedIn(true);

      return true;
    } catch (error) {
      console.error('Failed to update token', error);

      return false;
    }
  };

  const handleRemoveAccessToken = async () => {
    try {
      await authManager.removeAccessToken();
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
        saveAccessToken: handleSaveAccessToken,
        removeAccessToken: handleRemoveAccessToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const { isLoggedIn, saveAccessToken, removeAccessToken } = useContext(AuthContext);
  return { isLoggedIn, saveAccessToken, removeAccessToken };
};

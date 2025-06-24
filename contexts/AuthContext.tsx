import { authManager } from '@/core/storage';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isLoggedIn: Nullable<boolean>;
  saveAccessToken: (accessToken: string) => Promise<boolean>;
  removeAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: null,
  saveAccessToken: () => Promise.resolve(false),
  removeAccessToken: () => Promise.resolve(false),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<Nullable<boolean>>(null);

  useEffect(() => {
    if (__DEV__) {
      console.log('[Auth State] Login status changed:', isLoggedIn);
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

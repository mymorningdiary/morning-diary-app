import { useStorageState } from '@/hooks/useStorageState';
import { createContext, type PropsWithChildren, use, useEffect } from 'react';

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({ signIn: () => null, signOut: () => null, session: null, isLoading: false });

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

let globalSignOut: (() => void) | null = null;

export function getAuthHelpers() {
  if (!globalSignOut) throw new Error('Auth not initialized');
  return { signOut: globalSignOut };
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const signIn = (token: string) => {
    setSession(token);
  };

  const signOut = () => {
    setSession(null);
  };

  globalSignOut = signOut;

  useEffect(() => {
    console.log('[SessionProvider] session:', session);
  }, [session]);

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}
import { useStorageState } from '@/hooks/useStorageState';
import { createContext, type PropsWithChildren, use, useEffect } from 'react';

const AuthContext = createContext<{
  session?: string | null;
  hasVisited?: string | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  setHasVisited: (value: string | null) => void;
}>({
  session: null,
  hasVisited: null,
  isLoading: false,
  signIn: () => null,
  signOut: () => null,
  setHasVisited: () => null,
});

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
  const [[isSessionLoading, session], setSession] = useStorageState('session');
  const [[isVisitedLoading, hasVisited], setHasVisited] = useStorageState('hasVisited');
  const isLoading = isSessionLoading || isVisitedLoading;

  const signIn = (token: string) => {
    setSession(token);
  };

  const signOut = () => {
    setSession(null);
  };

  globalSignOut = signOut;

  useEffect(() => {
    console.log('[SessionProvider] session:', session, 'hasVisited:', hasVisited);
  }, [session, hasVisited]);

  return (
    <AuthContext
      value={{
        session,
        hasVisited,
        isLoading,
        signIn,
        signOut,
        setHasVisited,
      }}>
      {children}
    </AuthContext>
  );
}
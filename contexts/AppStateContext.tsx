import { useStorageState } from '@/hooks/useStorageState';
import { createContext, type PropsWithChildren, use, useEffect } from 'react';

const AppStateContext = createContext<{
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

export function useAppState() {
  const value = use(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be wrapped in a <SessionProvider />');
  }

  return value;
}

let globalSignOut: (() => void) | null = null;

export function getAppStateHelpers() {
  if (!globalSignOut) throw new Error('Auth not initialized');
  return { signOut: globalSignOut };
}

export function AppStateProvider({ children }: PropsWithChildren) {
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
    console.log('[AppStateProvider] session:', session, 'hasVisited:', hasVisited);
  }, [session, hasVisited]);

  return (
    <AppStateContext
      value={{
        session,
        hasVisited,
        isLoading,
        signIn,
        signOut,
        setHasVisited,
      }}>
      {children}
    </AppStateContext>
  );
}

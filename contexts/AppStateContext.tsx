import appAPI from '@/core/api/app/apis';
import { AppVersion } from '@/core/types';
import { useStorageState } from '@/hooks/useStorageState';
import { useQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';

const AppStateContext = createContext<{
  session?: string | null;
  hasVisited?: string | null;
  isLoading: boolean;
  version?: AppVersion | null;
  signIn: (token: string) => void;
  signOut: () => void;
  setHasVisited: (value: string | null) => void;
}>({
  session: null,
  hasVisited: null,
  isLoading: false,
  version: null,
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
  const [version, setVersion] = useState<AppVersion | null>(null);

  const { data } = useQuery({
    queryKey: ['appVersion'],
    queryFn: () => appAPI.getAppVersion(),
  });

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

  useEffect(() => {
    if (data?.code === 2000) {
      setVersion(data.data);
    }
  }, [data]);

  return (
    <AppStateContext
      value={{
        session,
        hasVisited,
        isLoading,
        version,
        signIn,
        signOut,
        setHasVisited,
      }}>
      {children}
    </AppStateContext>
  );
}

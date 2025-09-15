import appAPI from '@/core/api/app/apis';
import { AppVersion } from '@/core/types';
import { useStorageState } from '@/hooks/useStorageState';
import { useQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import semver from 'semver';
import { setGlobalSignOutHandler } from '@/core/api/authHandlers';

const AppStateContext = createContext<{
  session?: string | null;
  hasVisited?: string | null;
  isLoading: boolean;
  appVersion?: AppVersion | null;
  isForceUpdateNeeded: boolean;
  signIn: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  setHasVisited: (value: string | null) => void;
}>({
  session: null,
  hasVisited: null,
  isLoading: false,
  appVersion: null,
  isForceUpdateNeeded: false,
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
  const [[isSessionLoading, session], setSession] = useStorageState('accessToken');
  const [_, setRefreshToken] = useStorageState('refreshToken');
  const [[isVisitedLoading, hasVisited], setHasVisited] = useStorageState('hasVisited');
  const isLoading = isSessionLoading || isVisitedLoading;
  const [appVersion, setAppVersion] = useState<AppVersion | null>(null);
  const [isForceUpdateNeeded, setForceUpdateNeeded] = useState(false);

  const { data } = useQuery({
    queryKey: ['appVersion'],
    queryFn: () => appAPI.getAppVersion(),
  });

  const signIn = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    setSession(accessToken);
    setRefreshToken(refreshToken);
  };

  const signOut = () => {
    setSession(null);
    setRefreshToken(null);
  };

  setGlobalSignOutHandler(signOut);

  useEffect(() => {
    if (data?.code === 2000) {
      setAppVersion(data.data);

      // 강제 업데이트 로직
      try {
        const { android, ios } = data.data;
        const minVersion = Platform.select({
          android: android.minVersion,
          ios: ios.minVersion,
          default: null,
        });
        const currentVersion = Application.nativeApplicationVersion;
        if (!currentVersion || !minVersion) return;

        if (semver.lt(currentVersion, minVersion)) {
          setForceUpdateNeeded(true);
        }
      } catch (e) {
        console.error('Failed to compare version', e);
      }
    }
  }, [data]);

  useEffect(() => {
    console.log('[AppStateProvider] session:', session, 'hasVisited:', hasVisited);
  }, [session, hasVisited]);

  return (
    <AppStateContext
      value={{
        session,
        hasVisited,
        isLoading,
        appVersion,
        isForceUpdateNeeded,
        signIn,
        signOut,
        setHasVisited,
      }}>
      {children}
    </AppStateContext>
  );
}

import appAPI from '@/core/api/app/apis';
import { AppVersion, Auth } from '@/core/types';
import { useStorageState } from '@/hooks/useStorageState';
import { useQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import semver from 'semver';
import { setGlobalSignInHandler, setGlobalSignOutHandler } from '@/core/api/authHandlers';

const AppStateContext = createContext<{
  session?: string | null;
  hasVisited?: string | null;
  isLoading: boolean;
  appVersion?: AppVersion | null;
  isUpdateNeeded: boolean;
  isForceUpdateNeeded: boolean;
  signIn: ({ accessToken, refreshToken }: Auth) => void;
  signOut: () => void;
  setHasVisited: (value: string | null) => void;
}>({
  session: null,
  hasVisited: null,
  isLoading: false,
  appVersion: null,
  isUpdateNeeded: false,
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
  const [isUpdateNeeded, setUpdateNeeded] = useState(true); // 선택 업데이트
  const [isForceUpdateNeeded, setForceUpdateNeeded] = useState(false); // 강제 업데이트

  const { data } = useQuery({
    queryKey: ['appVersion'],
    queryFn: () => appAPI.getAppVersion(),
  });

  const signIn = ({ accessToken, refreshToken }: Auth) => {
    setSession(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  };

  const signOut = () => {
    setSession(null);
    setRefreshToken(null);
  };

  setGlobalSignInHandler(signIn);
  setGlobalSignOutHandler(signOut);

  useEffect(() => {
    if (data?.code === 2000) {
      setAppVersion(data.data);

      try {
        const { android, ios } = data.data;
        const version = Platform.select({
          android: android.version,
          ios: ios.version,
          default: null,
        });
        const minVersion = Platform.select({
          android: android.minVersion,
          ios: ios.minVersion,
          default: null,
        });

        const currentVersion = Application.nativeApplicationVersion;
        if (currentVersion === null) return;

        // 강제 업데이트 활성화
        if (minVersion && semver.lt(currentVersion, minVersion)) {
          setForceUpdateNeeded(true);
          return;
        }

        // 선택 업데이트 활성화
        if (version && semver.lt(currentVersion, version)) {
          setUpdateNeeded(true);
        }
      } catch (e) {
        console.error('Failed to compare version', e);
      }
    }
  }, [data]);

  return (
    <AppStateContext
      value={{
        session,
        hasVisited,
        isLoading,
        appVersion,
        isUpdateNeeded,
        isForceUpdateNeeded,
        signIn,
        signOut,
        setHasVisited,
      }}>
      {children}
    </AppStateContext>
  );
}

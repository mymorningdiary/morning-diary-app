import appAPI from '@/core/api/app/apis';
import {
  setGlobalClearAuthTokenHandler,
  setGlobalSetAuthTokenHandler,
} from '@/core/api/authHandlers';
import { appManager } from '@/core/storage';
import { AppVersion, Auth } from '@/core/types';
import { useStorageState } from '@/hooks/useStorageState';
import { useQuery } from '@tanstack/react-query';
import * as Application from 'expo-application';
import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import semver from 'semver';

const AppStateContext = createContext<{
  session: string | null;
  hasVisited: boolean | null;
  isLoading: boolean;
  appVersion?: AppVersion | null;
  isUpdateNeeded: boolean;
  isForceUpdateNeeded: boolean;
  setAuthToken: ({ accessToken, refreshToken }: Auth) => void;
  clearAuthToken: () => void;
  markVisited: () => void;
}>({
  session: null,
  hasVisited: null,
  isLoading: false,
  appVersion: null,
  isUpdateNeeded: false,
  isForceUpdateNeeded: false,
  setAuthToken: () => null,
  clearAuthToken: () => null,
  markVisited: () => null,
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
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);
  const isLoading = isSessionLoading || hasVisited === null;

  const [appVersion, setAppVersion] = useState<AppVersion | null>(null);
  const [isUpdateNeeded, setUpdateNeeded] = useState(false); // 선택 업데이트
  const [isForceUpdateNeeded, setForceUpdateNeeded] = useState(false); // 강제 업데이트

  const { data } = useQuery({
    queryKey: ['appVersion'],
    queryFn: () => appAPI.getAppVersion(),
  });

  const setAuthToken = ({ accessToken, refreshToken }: Auth) => {
    setSession(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  };

  const clearAuthToken = () => {
    setSession(null);
    setRefreshToken(null);
  };

  const markVisited = () => {
    try {
      appManager.markVisited();
    } catch (e) {
      console.error(e);
    } finally {
      setHasVisited(true);
    }
  };

  setGlobalSetAuthTokenHandler(setAuthToken);
  setGlobalClearAuthTokenHandler(clearAuthToken);

  useEffect(() => {
    (async () => {
      try {
        const visited = await appManager.hasVisited();
        setHasVisited(visited);
      } catch (e) {
        console.error(e);
        markVisited();
      }
    })();
  }, []);

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
        // if (minVersion && semver.lt(currentVersion, minVersion)) {
        //   setForceUpdateNeeded(true);
        //   return;
        // }

        // 선택 업데이트 활성화
        if (true) {
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
        setAuthToken,
        clearAuthToken,
        markVisited,
      }}>
      {children}
    </AppStateContext>
  );
}

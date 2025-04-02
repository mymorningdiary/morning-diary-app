import { appStateManager } from '@/core/storage';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AppStateContextType = {
  isFirstLaunch: Nullable<boolean>;
};

const AppStateContext = createContext<AppStateContextType>({
  isFirstLaunch: null,
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<Nullable<boolean>>(null);

  useEffect(() => {
    if (__DEV__) {
      console.log('[AppState] First launch status changed:', isFirstLaunch);
    }
  }, [isFirstLaunch]);

  useEffect(() => {
    const checkIsFirstLaunch = async () => {
      try {
        const isFirstLaunch = await appStateManager.checkFirstLaunch();
        setIsFirstLaunch(isFirstLaunch); // true -> 온보딩 화면, false -> 로그인 화면, null -> 대기
      } catch (error) {
        console.error('Failed to check if first launch', error);
        setIsFirstLaunch(true); // -> 온보딩 화면
      }
    };

    checkIsFirstLaunch();
  }, []);

  useEffect(() => {
    const markFirstLaunch = async () => {
      try {
        await appStateManager.markFirstLaunch();
      } catch (error) {
        console.error('Failed to mark first launch', error);
      }
    };

    markFirstLaunch();
  }, []);

  return <AppStateContext.Provider value={{ isFirstLaunch }}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => {
  const { isFirstLaunch } = useContext(AppStateContext);

  return { isFirstLaunch };
};

import { appManager } from '@/core/storage';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  isFirstLaunch: Nullable<boolean>;
};

const AppContext = createContext<AppContextType>({
  isFirstLaunch: null,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isFirstLaunch, setIsFirstLaunch] = useState<Nullable<boolean>>(null);

  useEffect(() => {
    if (__DEV__) {
      console.log('[AppState] First launch status changed:', isFirstLaunch);
    }
  }, [isFirstLaunch]);

  useEffect(() => {
    const checkIsFirstLaunch = async () => {
      try {
        const isFirstLaunch = await appManager.checkFirstLaunch();
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
        await appManager.markFirstLaunch();
      } catch (error) {
        console.error('Failed to mark first launch', error);
      }
    };

    markFirstLaunch();
  }, []);

  return <AppContext.Provider value={{ isFirstLaunch }}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const { isFirstLaunch } = useContext(AppContext);

  return { isFirstLaunch };
};

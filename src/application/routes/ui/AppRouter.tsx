import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { ForceUpdatePage } from '@pages/force-update';
import { useVisit } from '@features/onboarding';
import { useAuth } from '@entities/auth';
import { useAppVersion } from '@entities/version';
import { MDToast } from '@shared/ui/Toast';
import { MDModal } from '@shared/ui/Modal';
import { Logger } from '@shared/lib/log';
import { openMarketApp } from '@shared/lib/links';

export function AppRouter() {
  const { accessToken, isLoaded: isAuthLoaded } = useAuth();
  const { isFirstVisit, isLoaded: isVisitLoaded } = useVisit();
  const isReady = isAuthLoaded && isVisitLoaded;

  const { versionStatus } = useAppVersion();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    Logger('AppRouter').debug('isAuthLoaded:', isAuthLoaded, ', accessToken:', accessToken);
  }, [isAuthLoaded, accessToken]);

  useEffect(() => {
    Logger('AppRouter').debug('isVisitLoaded:', isVisitLoaded, ', isFirstVisit:', isFirstVisit);
  }, [isVisitLoaded, isFirstVisit]);

  useEffect(() => {
    void SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    if (versionStatus === 'warn') {
      setShowUpdateModal(true);
    }
  }, [versionStatus]);

  if (!isReady) {
    return null;
  }

  if (versionStatus === 'force') {
    return <ForceUpdatePage />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isFirstVisit !== false}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!accessToken && isFirstVisit === false}>
          <Stack.Screen name="login-social" />
          <Stack.Screen name="login-email" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!accessToken && isFirstVisit === false}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
      <MDToast />
      <MDModal
        visible={versionStatus === 'warn' && showUpdateModal}
        title={'새로운 버전이 나왔어요!'}
        subtitle={`아침일기가 사용성 개선을 위해 업데이트를 준비했어요. 지금 바로 만나보세요 🌞`}
        positive={{
          text: '업데이트 하기',
          onPress: () => {
            setShowUpdateModal(false);
            openMarketApp();
          },
        }}
        negative={{ text: '취소', onPress: () => setShowUpdateModal(false) }}
        onClose={() => setShowUpdateModal(false)}
      />
    </>
  );
}

import { Logger } from '@/utils/logs';
import { useAppVersion } from '@entities/version';
import { useVisited } from '@features/onboarding';
import { ForceUpdatePage } from '@pages/force-update';
import { useAuthStore } from '@shared/lib/auth';
import { openMarketApp } from '@shared/lib/links';

import { MDToast } from '@shared/ui/MDToast';
import { MDModal } from '@shared/ui/Modal';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export function AppRouter() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthLoaded = useAuthStore((s) => s.isAuthLoaded);
  const { isFirstVisit, isLoading: isVisitedLoading } = useVisited();
  const isLoading = !isAuthLoaded || isVisitedLoading || isFirstVisit === null;

  const { versionStatus } = useAppVersion();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (versionStatus === 'warn') {
      setShowUpdateModal(true);
    }
  }, [versionStatus]);

  useEffect(() => {
    Logger('AppRouter').debug('isAuthLoaded:', isAuthLoaded, 'accessToken:', accessToken);
  }, [isAuthLoaded, accessToken]);

  useEffect(() => {
    Logger('AppRouter').debug('isFirstVisit:', isFirstVisit);
  }, [isFirstVisit]);

  if (isLoading) {
    return null;
  }

  if (versionStatus === 'force') {
    return <ForceUpdatePage />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isFirstVisit === true}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!accessToken && isFirstVisit === false}>
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-in-email" />
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

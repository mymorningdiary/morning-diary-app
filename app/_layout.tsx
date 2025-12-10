import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import { MDDarkTheme, MDLightTheme } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/contexts/AppStateContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SplashScreenController } from '@/core/splash';
import { openStoreLink } from '@/utils/links';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import ForceUpdateScreen from './force-update';
import { Logger } from '@/utils/logs';
import analytics from '@react-native-firebase/analytics';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const kakaoAppKey = process.env.EXPO_PUBLIC_KAKAO_APP_KEY;
    if (kakaoAppKey) {
      initializeKakaoSDK(kakaoAppKey);
    }
  }, []);

  useEffect(() => {
    async function initializeAnalytics() {
      try {
        await analytics().setAnalyticsCollectionEnabled(true);
        Logger('Root').debug('Success to initialize firebase analytics');
      } catch (error) {
        Logger('Root').warn('Failed to initialize firebase analytics', error);
      }
    }
    initializeAnalytics();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <NotificationProvider>
            <SplashScreenController />
            <RootNavigator />
          </NotificationProvider>
        </AppStateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session, hasVisited, isLoading, isUpdateNeeded, isForceUpdateNeeded } = useAppState();
  const [showUpdateAppModal, setShowUpdateAppModal] = useState(false);

  useEffect(() => {
    Logger('RootLayout').debug('session:', session, 'hasVisited:', hasVisited);
  }, [session, hasVisited]);

  useEffect(() => {
    if (isUpdateNeeded) {
      setShowUpdateAppModal(true);
    }
  }, [isUpdateNeeded]);

  if (isLoading) {
    return null;
  }

  if (isForceUpdateNeeded) {
    return <ForceUpdateScreen />;
  }

  return (
    <>
      <MDDefaultModal
        visible={showUpdateAppModal}
        title={'새로운 버전이 나왔어요!'}
        subtitle={`아침일기가 사용성 개선을 위해 업데이트를 준비했어요. 지금 바로 만나보세요 🌞`}
        positiveButton={{ text: '업데이트 하기', onPress: openStoreLink }}
        negativeButton={{ text: '취소', onPress: () => setShowUpdateAppModal(false) }}
        onClose={() => setShowUpdateAppModal(false)}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={hasVisited === false}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!session && hasVisited === true}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-in-email" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!session && hasVisited === true}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
    </>
  );
}

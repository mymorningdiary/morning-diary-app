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
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import ForceUpdateScreen from './force-update';

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
    console.log('[RootNavigator] session:', session, 'hasVisited:', hasVisited);
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
        title={`아침일기가 사용성 개선을 위해 업데이트를 준비했어요.\n지금 바로 만나보세요 🌞`}
        positiveButton={{ text: '업데이트 하기', onPress: openStoreLink }}
        onClose={() => setShowUpdateAppModal(false)}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!session && hasVisited === null}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!session && hasVisited === 'true'}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
    </>
  );
}

import { ScreenName } from '@/constants/utils';
import { SessionManager } from '@/core/storage';
import { useAuth } from '@/hooks';
import { Link, router, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { autoLogin, isAutoLoginLoading, nextScreen } = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      autoLogin();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isAutoLoginLoading && nextScreen !== null) {
      SplashScreen.hideAsync();
      switch (nextScreen) {
        case ScreenName.ONBOARDING:
          router.replace('/onboarding');
          break;
        case ScreenName.MAIN:
          router.replace('/main');
          break;
        case ScreenName.LOGIN:
          router.replace('/login');
          break;
      }
    }
  }, [isAutoLoginLoading, nextScreen]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/login">Login</Link>
    </View>
  );
}

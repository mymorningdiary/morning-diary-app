import { useAppState } from '@/contexts/AppStateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks';
import { Route } from '@/types/navigations';

import { router, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const styles = screenStyles();
  const colors = useThemeColor();

  const { isFirstLaunch } = useAppState();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    console.log('[Index] Effect triggered - isLoggedIn:', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (isFirstLaunch === null) return;

    SplashScreen.hideAsync();

    const route: Route = isFirstLaunch ? '/onboarding' : isLoggedIn ? '/main' : '/login';
    router.replace(route);
  }, [isFirstLaunch, isLoggedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary.normal} />
    </View>
  );
}

const screenStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

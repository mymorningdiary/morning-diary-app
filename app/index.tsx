import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext3';
import { useThemeColor } from '@/hooks';
import { Route } from '@/types/navigations';

import { router, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const styles = screenStyles();
  const colors = useThemeColor();

  const { isFirstLaunch } = useApp();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    console.log(
      `[Index] Effect triggered - isFirstLaunch: ${isFirstLaunch}, isLoggedIn: ${isLoggedIn}  `,
    );

    if (isFirstLaunch === null || isLoggedIn === null) return;

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

import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function withAuthGuard<T extends object>(Component: React.ComponentType<T>) {
  return function AuthGuardedComponent(props: T) {
    const { isLoggedIn } = useAuth();

    useEffect(() => {
      if (isLoggedIn === false) {
      }
    }, [isLoggedIn]);

    // 로딩 중일 때
    if (isLoggedIn === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    // 로그인되지 않았을 때 (리다이렉트 전까지 잠시)
    if (isLoggedIn === false) {
      return null;
    }

    // 로그인된 상태일 때만 실제 컴포넌트 렌더링
    return <Component {...props} />;
  };
}

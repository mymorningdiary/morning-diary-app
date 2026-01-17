import { StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/MDPage';
import { router } from 'expo-router';

export function LoginEmailPage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="이메일 로그인" onBack={() => router.back()} />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

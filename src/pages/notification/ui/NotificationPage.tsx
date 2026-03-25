import { StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { MDButton } from '@shared/ui/Button';

export function NotificationPage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="알림" onBack={() => router.back()} />

      <MDButton style={styles.button} label="탈퇴하기" />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  button: {
    marginHorizontal: 16,
  },
});

import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';

export function ReportPage() {
  return (
    <MDPage style={styles.container}>
      <MDAppBar title="주간 보고서" onBack={() => router.back()} />
    </MDPage>
  );
}

const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});

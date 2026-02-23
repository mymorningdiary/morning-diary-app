import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { useThemeColor } from '@shared/lib/theme';
import { getSingleParam } from '@shared/lib/router';

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);

  if (!dayjs(dateParam).isValid()) {
    return <Redirect href="/(app)" />;
  }

  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 ddd');

  return (
    <MDPage style={styles.container}>
      <MDAppBar title={formattedDate} onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}></KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

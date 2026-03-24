import { ScrollView, StyleSheet, View } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { AccountSection } from './AccountSection';
import { AccountManagementSection } from './AccountManagementSection';

export function AccountPage() {
  const styles = PageStyles;

  return (
    <MDPage>
      <MDAppBar title="계정 관리" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View>
          <AccountSection />

          <AccountManagementSection isLast />
        </View>
      </ScrollView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 60,
  },
});

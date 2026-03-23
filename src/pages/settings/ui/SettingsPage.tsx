import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { isProduction } from '@shared/config';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { SettingsAccountSection } from './SettingsAccountSection';
import { SettingsCommunicationSection } from './SettingsCommunicationSection';
import { SettingsInfoSection } from './SettingsInfoSection';
import { SettingsSystemSection } from './SettingsSystemSection';
import { SettingsTestSection } from './SettingsTestSection';

export function SettingsPage() {
  const styles = PageStyles;

  return (
    <MDPage>
      <MDAppBar title="설정" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        <View>
          <SettingsAccountSection />

          <SettingsSystemSection />

          <SettingsCommunicationSection />

          <SettingsInfoSection isLast={isProduction} />

          {!isProduction && <SettingsTestSection isLast />}
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

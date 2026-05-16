import { ScrollView, StyleSheet, View } from 'react-native';

import { isProduction } from '@shared/config';
import { MDPage } from '@shared/ui/Layout';
import { SettingsAccountSection } from './SettingsAccountSection';
import { SettingsCommunicationSection } from './SettingsCommunicationSection';
import { SettingsInfoSection } from './SettingsInfoSection';
import { SettingsSystemSection } from './SettingsSystemSection';
import { SettingsTestSection } from './SettingsTestSection';

export function SettingsPage() {
  return (
    <MDPage>
      <ScrollView
        contentContainerStyle={styles.listContent}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        bounces={false}>
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

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 56 + 24, // 탭바 높이 + 패딩
  },
});

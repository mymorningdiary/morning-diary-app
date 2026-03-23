import crashlytics from '@react-native-firebase/crashlytics';

import { SettingsSection } from './SettingsSection';
import { SettingsSectionListItem } from './SettingsSectionListItem';

interface Props {
  isLast?: boolean;
}

export function SettingsTestSection({ isLast }: Props) {
  return (
    <SettingsSection title="테스트" isLast={isLast}>
      <SettingsSectionListItem label="[Dev] crash test" onPress={() => crashlytics().crash()} />
    </SettingsSection>
  );
}

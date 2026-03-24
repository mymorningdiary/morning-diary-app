import crashlytics from '@react-native-firebase/crashlytics';

import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function SettingsTestSection({ isLast }: Props) {
  return (
    <MDSection title="테스트" isLast={isLast}>
      <MDListItem label="[Dev] crash test" onPress={() => crashlytics().crash()} />
    </MDSection>
  );
}

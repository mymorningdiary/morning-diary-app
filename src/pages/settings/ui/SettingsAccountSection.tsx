import { router } from 'expo-router';

import { IconChevronRight } from '@assets/icons';
import { MDButton } from '@shared/ui/Button';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionListItem } from './SettingsSectionListItem';

interface Props {
  isLast?: boolean;
}

export function SettingsAccountSection({ isLast }: Props) {
  return (
    <SettingsSection title="계정" isLast={isLast}>
      <SettingsSectionListItem
        label="계정 관리"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() => router.push('/account')}
      />
    </SettingsSection>
  );
}

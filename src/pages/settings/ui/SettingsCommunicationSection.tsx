import { router } from 'expo-router';

import { IconChevronRight } from '@assets/icons';
import { SETTINGS_FEEDBACK_URL } from '@pages/settings/config/constants';
import { openMarketApp } from '@shared/lib/links';
import { MDButton } from '@shared/ui/Button';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionListItem } from './SettingsSectionListItem';

interface Props {
  isLast?: boolean;
}

export function SettingsCommunicationSection({ isLast }: Props) {
  return (
    <SettingsSection title="소통" isLast={isLast}>
      <SettingsSectionListItem
        label="개발자에게 의견 보내기"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: SETTINGS_FEEDBACK_URL },
          })
        }
      />
      <SettingsSectionListItem label="리뷰 남기기" onPress={openMarketApp} />
    </SettingsSection>
  );
}

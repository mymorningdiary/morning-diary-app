import * as Application from 'expo-application';

import { MDButton } from '@shared/ui/Button';
import { router } from 'expo-router';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionListItem } from './SettingsSectionListItem';
import { useAppVersion } from '@entities/version';
import { TERMS_PRIVACY_URL, TERMS_USE_URL } from '@shared/config';

interface Props {
  isLast?: boolean;
}

export function SettingsInfoSection({ isLast = false }: Props) {
  const { versionStatus } = useAppVersion();
  const isUpdateNeeded = versionStatus !== 'ok';

  return (
    <SettingsSection title="정보" isLast={isLast}>
      <SettingsSectionListItem
        label="이용약관"
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: TERMS_USE_URL },
          })
        }
      />
      <SettingsSectionListItem
        label="개인정보처리방침"
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: TERMS_PRIVACY_URL },
          })
        }
      />
      <SettingsSectionListItem
        label={`버전 정보 ${Application.nativeApplicationVersion}`}
        rightContent={
          <MDButton
            variant="ghost"
            disabled={!isUpdateNeeded}
            label={!isUpdateNeeded ? '최신 버전' : '업데이트 하기'}
          />
        }
      />
    </SettingsSection>
  );
}

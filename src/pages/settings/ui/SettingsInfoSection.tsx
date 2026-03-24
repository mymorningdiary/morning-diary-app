import { nativeApplicationVersion } from 'expo-application';
import { router } from 'expo-router';

import { IconChevronRight } from '@assets/icons';
import { useAppVersion } from '@entities/version';
import { TERMS_PRIVACY_URL, TERMS_USE_URL } from '@shared/config';
import { MDButton } from '@shared/ui/Button';
import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function SettingsInfoSection({ isLast = false }: Props) {
  const { versionStatus } = useAppVersion();
  const isUpdateNeeded = versionStatus !== 'ok';

  return (
    <MDSection title="정보" isLast={isLast}>
      <MDListItem
        label="이용약관"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: TERMS_USE_URL },
          })
        }
      />
      <MDListItem
        label="개인정보처리방침"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: TERMS_PRIVACY_URL },
          })
        }
      />
      <MDListItem
        label={`버전 정보 ${nativeApplicationVersion}`}
        rightContent={
          <MDButton
            variant="ghost"
            disabled={!isUpdateNeeded}
            label={!isUpdateNeeded ? '최신 버전' : '업데이트 하기'}
          />
        }
      />
    </MDSection>
  );
}

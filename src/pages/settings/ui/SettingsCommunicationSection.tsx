import { router } from 'expo-router';

import { IconChevronRight } from '@assets/icons';
import { FEEDBACK_URL } from '@shared/config';
import { openMarketApp } from '@shared/lib/links';
import { MDButton } from '@shared/ui/Button';
import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function SettingsCommunicationSection({ isLast }: Props) {
  return (
    <MDSection title="소통" isLast={isLast}>
      <MDListItem
        label="개발자에게 의견 보내기"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() =>
          router.push({
            pathname: '/web-view',
            params: { webviewURL: FEEDBACK_URL },
          })
        }
      />
      <MDListItem label="리뷰 남기기" onPress={openMarketApp} />
    </MDSection>
  );
}

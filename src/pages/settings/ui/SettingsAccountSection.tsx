import { router } from 'expo-router';

import { IconChevronRight } from '@assets/icons';
import { MDButton } from '@shared/ui/Button';
import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function SettingsAccountSection({ isLast }: Props) {
  return (
    <MDSection title="계정" isLast={isLast}>
      <MDListItem
        label="계정 관리"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() => router.push('/account')}
      />
    </MDSection>
  );
}

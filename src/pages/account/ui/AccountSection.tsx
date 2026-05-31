import { router } from 'expo-router';

import { useUser } from '@entities/user';
import { useThemeColor } from '@shared/lib/theme';
import { MDListItem, MDSection } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

type LoginType = 'KAKAO' | 'APPLE';

const LOGIN_TYPE_LABEL: Record<LoginType, string> = {
  KAKAO: '카카오 연동',
  APPLE: '애플 연동',
};

interface Props {
  isLast?: boolean;
}

export function AccountSection({ isLast }: Props) {
  const colors = useThemeColor();

  const { user } = useUser();
  const loginType = user?.loginType ? (LOGIN_TYPE_LABEL[user.loginType as LoginType] ?? '') : '';

  return (
    <MDSection title="계정" isLast={isLast}>
      <MDListItem
        label={user?.email ?? ''}
        rightContent={
          <MDText type="bodyRegular" color={colors.text.alternative}>
            {loginType}
          </MDText>
        }
      />
    </MDSection>
  );
}

import { useState } from 'react';

import { IconChevronRight } from '@assets/icons';
import { useSignOut } from '@entities/auth';
import { useToastStore } from '@shared/lib/toast';
import { MDListItem, MDSection } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { MDButton } from '@shared/ui/Button';
import { router } from 'expo-router';

interface Props {
  isLast?: boolean;
}

export function AccountManagementSection({ isLast }: Props) {
  const { signOut, isPending } = useSignOut({
    onError: (message) => {
      if (!message) return;
      useToastStore.getState().show({ type: 'error', message });
    },
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    if (isPending) return;
    signOut();
  };

  return (
    <MDSection isLast={isLast}>
      <MDListItem label="로그아웃" onPress={() => setShowLogoutModal(true)} />

      <MDListItem
        label="회원 탈퇴"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() => router.push({ pathname: '/withdraw' })}
      />

      <MDModal
        visible={showLogoutModal}
        subtitle={`로그아웃 하시겠어요?`}
        negative={{ text: '취소', onPress: () => setShowLogoutModal(false) }}
        positive={{ text: '로그아웃', onPress: handleLogout }}
        onClose={() => setShowLogoutModal(false)}
      />
    </MDSection>
  );
}

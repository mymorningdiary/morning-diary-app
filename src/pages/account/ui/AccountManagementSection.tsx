import { useState } from 'react';

import { useSignOut } from '@entities/auth';
import { useToastStore } from '@shared/lib/toast';
import { MDListItem, MDSection } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';

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

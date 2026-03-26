import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

import { IconChevronRight } from '@assets/icons';
import { useNotification } from '@features/notification';
import { useForeground } from '@shared/lib/app-state';
import { MDButton } from '@shared/ui/Button';
import { MDModal } from '@shared/ui/Modal';
import { MDSwitch } from '@shared/ui/Switch';

import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function SettingsSystemSection({ isLast }: Props) {
  const { isPushOn, disabledAsk, togglePushOn, setDisabledAsk, checkPermission } =
    useNotification();

  useForeground(checkPermission);

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <MDSection title="시스템 설정" isLast={isLast}>
      <MDListItem
        label="알림"
        rightContent={<MDSwitch checked={isPushOn ?? false} onChange={togglePushOn} />}
      />
      <MDListItem
        label="알림 시간"
        disabled={!isPushOn}
        rightContent={
          <MDButton
            variant="ghost"
            style={{ width: 24, height: 24 }}
            prefix={IconChevronRight}
            disabled={!isPushOn}
          />
        }
        onPress={() =>
          router.push({
            pathname: '/notification',
          })
        }
      />
      <MDListItem
        label="아침일기 목표"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() => router.push('/text-goal')}
      />

      <MDModal
        visible={disabledAsk}
        subtitle={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
        negative={{ text: '취소', onPress: () => setDisabledAsk(false) }}
        positive={{
          text: '알림 허용',
          onPress: () => {
            Linking.openSettings();
            setDisabledAsk(false);
          },
        }}
        onClose={() => setDisabledAsk(false)}
      />
    </MDSection>
  );
}

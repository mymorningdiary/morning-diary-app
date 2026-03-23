import { MDSwitch } from '@shared/ui/Switch';

import { IconChevronRight } from '@assets/icons';
import { MDButton } from '@shared/ui/Button';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionListItem } from './SettingsSectionListItem';
import { router } from 'expo-router';
import { useSettingsNotifications } from '../model/useSettingsNotifications';
import { MDModal } from '@shared/ui/Modal';

interface Props {
  isLast?: boolean;
}

export function SettingsSystemSection({ isLast }: Props) {
  const {
    isAlarmOn,
    onAlarmToggle,
    onClosePermissionModal,
    onOpenDeviceSettings,
    showPermissionModal,
  } = useSettingsNotifications();

  return (
    <SettingsSection title="시스템 설정" isLast={isLast}>
      <SettingsSectionListItem
        label="알림"
        rightContent={<MDSwitch checked={isAlarmOn ?? false} onChange={onAlarmToggle} />}
      />
      <SettingsSectionListItem
        label="알림 시간"
        disabled={!isAlarmOn}
        rightContent={
          <MDButton
            variant="ghost"
            style={{ width: 24, height: 24 }}
            prefix={IconChevronRight}
            disabled={!isAlarmOn}
          />
        }
        onPress={() =>
          router.push({
            pathname: '/(app)/alarm-time',
          })
        }
      />
      <SettingsSectionListItem
        label="아침일기 목표"
        rightContent={
          <MDButton variant="ghost" style={{ width: 24, height: 24 }} prefix={IconChevronRight} />
        }
        onPress={() => router.push('/text-goal')}
      />

      <MDModal
        visible={showPermissionModal}
        subtitle={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
        negative={{ text: '취소', onPress: onClosePermissionModal }}
        positive={{ text: '알림 허용', onPress: onOpenDeviceSettings }}
        onClose={onClosePermissionModal}
      />
    </SettingsSection>
  );
}

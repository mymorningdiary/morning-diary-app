import { appManager } from '@/core/storage';
import { useUpdatePushToken } from '@/hooks';
import { useNotificationStore } from '@shared/lib/notifications';
import { Logger } from '@shared/lib/log';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

export function useSettingsNotifications() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState<boolean | null>(null);

  const pushToken = useNotificationStore((s) => s.pushToken);
  const { mutate: updatePushToken } = useUpdatePushToken();

  const onClosePermissionModal = () => {
    setShowPermissionModal(false);
  };

  const onOpenDeviceSettings = () => {
    Linking.openSettings();
    setShowPermissionModal(false);
  };

  const onAlarmToggle = async () => {
    try {
      if (isAlarmOn === true) {
        setIsAlarmOn(false);
      } else {
        const { granted, canAskAgain } = await Notifications.requestPermissionsAsync();

        if (granted === true) {
          setIsAlarmOn(true);
        }

        if (canAskAgain === false) {
          setShowPermissionModal(true);
        }
      }
    } catch (error) {
      Logger('SettingsScreen').error('Failed to request permission', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await Notifications.getPermissionsAsync();
        const alarmOn = await appManager.checkAlarmOn();

        if (granted === true && alarmOn === true) {
          setIsAlarmOn(true);
        } else {
          setIsAlarmOn(false);
        }
      } catch (error) {
        Logger('SettingsScreen').error('Failed to check alarm on', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAlarmOn === null) return;

    try {
      if (isAlarmOn === true && pushToken !== null) {
        updatePushToken({ pushToken });
        appManager.markAlarmOn();
      } else {
        updatePushToken({ pushToken: null });
        appManager.clearAlarmOn();
      }
    } catch (error) {
      Logger('SettingsScreen').error('Failed to update pushToken', error);
    }
  }, [isAlarmOn, pushToken, updatePushToken]);

  return {
    isAlarmOn,
    onAlarmToggle,
    onClosePermissionModal,
    onOpenDeviceSettings,
    showPermissionModal,
  };
}

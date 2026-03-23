import { useState } from 'react';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';

import { useNotificationPreferenceStore } from '@entities/notification';
import { Logger } from '@shared/lib/log';
import { useNotificationStore } from '@shared/lib/notifications';

export function useNotification() {
  const [hasPermission, setHasPermission] = useState(false);
  const [disabledAsk, setDisabledAsk] = useState(false);

  const pushToken = useNotificationStore((s) => s.pushToken);
  const { isPushOn, setIsPushOn } = useNotificationPreferenceStore();

  const canPush = isPushOn && hasPermission && pushToken != null;

  const togglePushOn = async () => {
    if (canPush) {
      setIsPushOn(false);
    } else {
      try {
        const { granted, canAskAgain } = await requestPermissionsAsync();
        setHasPermission(granted);

        if (granted == true) {
          setIsPushOn(true);
        }

        if (canAskAgain == false) {
          setDisabledAsk(true);
        }
      } catch (error) {
        Logger('SetNotificationListItem').error('Failed to check notification permission', error);
      }
    }
  };

  const checkPermission = async () => {
    try {
      const { granted } = await getPermissionsAsync();
      setHasPermission(granted);
    } catch (error) {
      Logger('SetNotificationListItem').error('Failed to check notification permission', error);
    }
  };

  return {
    isPushOn: canPush,
    hasPermission,
    disabledAsk,
    setHasPermission,
    setDisabledAsk,
    checkPermission,
    togglePushOn,
  };
}

import { useState } from 'react';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';

import { useNotificationPreferenceStore } from '@entities/notification';
import { Logger } from '@shared/lib/log';
import { useNotificationStore } from '@shared/lib/notifications';
import { useUpdatePushToken } from '@entities/user';
import { useToastStore } from '@shared/lib/toast';

export function useNotification() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [disabledAsk, setDisabledAsk] = useState(false);

  const pushToken = useNotificationStore((s) => s.pushToken);
  const { isPushOn, setIsPushOn } = useNotificationPreferenceStore();

  const canPush = isPushOn && hasPermission && pushToken != null;

  const { updatePushToken } = useUpdatePushToken({
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const turnPushOff = async () => {
    try {
      setIsPushOn(false);
      await updatePushToken({ pushToken: null });
    } catch (error) {
      setIsPushOn(true);
      Logger('SetNotificationListItem').error('Failed to sync push token', error);
    }
  };

  const turnPushOn = async () => {
    try {
      const { granted, canAskAgain } = await requestPermissionsAsync();
      setHasPermission(granted);

      if (!granted) {
        if (!canAskAgain) {
          setDisabledAsk(true);
        }
        return;
      }

      setIsPushOn(true);
      await updatePushToken({ pushToken });
    } catch (error) {
      setIsPushOn(false);
      Logger('SetNotificationListItem').error('Failed to sync push token', error);
    }
  };

  const togglePushOn = async () => {
    if (canPush) {
      await turnPushOff();
      return;
    }

    await turnPushOn();
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
    turnPushOff,
    turnPushOn,
    togglePushOn,
  };
}

import { useState } from 'react';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';

import { useNotificationPreferenceStore } from '@entities/notification';
import { Logger } from '@shared/lib/log';
import { useNotificationStore } from '@shared/lib/notifications';
import { useUpdatePushToken } from '@entities/user';
import { useToastStore } from '@shared/lib/toast';

export function useNotification() {
  const [hasPermission, setHasPermission] = useState(false);
  const [disabledAsk, setDisabledAsk] = useState(false);

  const pushToken = useNotificationStore((s) => s.pushToken);
  const { isPushOn, setIsPushOn } = useNotificationPreferenceStore();

  const canPush = isPushOn && hasPermission && pushToken != null;

  const { updatePushToken } = useUpdatePushToken({
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const togglePushOn = async () => {
    const cur = isPushOn;
    const next = !cur;

    try {
      if (next) {
        const { granted, canAskAgain } = await requestPermissionsAsync();
        setHasPermission(granted);

        if (!granted && !canAskAgain) {
          setDisabledAsk(true);
        }
      }

      setIsPushOn(next);
      await updatePushToken({ pushToken: next ? pushToken : null });
    } catch (error) {
      setIsPushOn(cur);
      Logger('SetNotificationListItem').error('Failed to sync push token', error);
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

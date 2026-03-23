import { useState } from 'react';
import { getPermissionsAsync } from 'expo-notifications';
import { Logger } from '@shared/lib/log';

export function useNotificationPermission() {
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermission = async () => {
    try {
      const { granted } = await getPermissionsAsync();
      setHasPermission(granted);
    } catch (error) {
      Logger('SetNotificationListItem').error('Failed to check notification permission', error);
    }
  };

  return {
    hasPermission,
    setHasPermission,
    checkPermission,
  };
}

import { Logger } from '@/utils/logs';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export const getPushToken = async () => {
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      Logger('Notification').error('Failed to find project ID');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    return token;
  } catch (e) {
    Logger('Notification').error('Failed to fetch expo pushToken', e);
    return null;
  }
};

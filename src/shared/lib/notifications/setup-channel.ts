import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const setupNotificationChannel = async () => {
  if (Device.osName !== 'Android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    sound: 'default',
  });
};

import * as Notifications from 'expo-notifications';

type ListenerParams = {
  onReceive: (n: Notifications.Notification) => void;
  onResponse: (r: Notifications.NotificationResponse) => void;
};

export const registerNotificationListeners = ({ onReceive, onResponse }: ListenerParams) => {
  const received = Notifications.addNotificationReceivedListener(onReceive);
  const response = Notifications.addNotificationResponseReceivedListener(onResponse);

  return () => {
    received.remove();
    response.remove();
  };
};

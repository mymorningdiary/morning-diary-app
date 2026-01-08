import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

type NotificationState = {
  pushToken: string | null;
  notification: Notifications.Notification | null;
  setPushToken: (token: string | null) => void;
  setNotification: (n: Notifications.Notification | null) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  pushToken: null,
  notification: null,
  setPushToken: (token) => set({ pushToken: token }),
  setNotification: (notification) => set({ notification }),
}));

import { devtools } from '@csark0812/zustand-expo-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationPreferenceState {
  isPushOn: boolean;
  isLoaded: boolean;
  setIsPushOn: (alarmOn: boolean) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

type NotificationPreferencePersist = Pick<NotificationPreferenceState, 'isPushOn'>;

const storage = createJSONStorage<NotificationPreferencePersist>(() => ({
  getItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value);
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key);
    return AsyncStorage.removeItem(key);
  },
}));

const notificationPreferencePersist = persist(
  (set) => ({
    isPushOn: false,
    isLoaded: false,
    setIsPushOn: (isPushOn: boolean) => set({ isPushOn }),
    setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
  }),
  {
    name: 'notification-preference-store',
    partialize: (state: NotificationPreferenceState): NotificationPreferencePersist => ({
      isPushOn: state.isPushOn,
    }),
    storage,
    onRehydrateStorage: (state) => {
      return () => state.setIsLoaded(true);
    },
  },
);

const storeCreator: StateCreator<
  NotificationPreferenceState,
  [],
  [['zustand/persist', NotificationPreferencePersist]]
> = __DEV__
  ? (devtools(notificationPreferencePersist, {
      name: 'notification-preference-store',
    }) as StateCreator<
      NotificationPreferenceState,
      [],
      [['zustand/persist', NotificationPreferencePersist]]
    >)
  : notificationPreferencePersist;

export const useNotificationPreferenceStore = create<NotificationPreferenceState>()(storeCreator);

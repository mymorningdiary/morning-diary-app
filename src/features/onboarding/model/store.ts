import { devtools } from '@csark0812/zustand-expo-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface VisitState {
  isFirstVisit: boolean | null;
  isLoaded: boolean;
  setIsFirstVisit: (isFirstVisit: boolean | null) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

type VisitPersist = Pick<VisitState, 'isFirstVisit'>;

const storage = createJSONStorage<VisitPersist>(() => ({
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

const visitPersist = persist(
  (set, get) => ({
    isFirstVisit: null,
    isLoaded: false,
    setIsFirstVisit: (isFirstVisit: boolean | null) => set({ isFirstVisit }),
    setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
  }),
  {
    name: 'visit-store',
    partialize: (state: VisitState): VisitPersist => ({
      isFirstVisit: state.isFirstVisit,
    }),
    storage,
    onRehydrateStorage: (state) => {
      return () => state.setIsLoaded(true);
    },
  },
);

const visitStoreCreator: StateCreator<VisitState, [], [['zustand/persist', VisitPersist]]> = __DEV__
  ? (devtools(visitPersist, { name: 'visit-store' }) as StateCreator<
      VisitState,
      [],
      [['zustand/persist', VisitPersist]]
    >)
  : visitPersist;

export const useVisitStore = create<VisitState>()(visitStoreCreator);

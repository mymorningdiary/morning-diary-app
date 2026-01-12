import { Platform } from 'react-native';
import { create, type StateCreator } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from '@csark0812/zustand-expo-devtools';

// FSD 예외: 도메인 로직 -> entities/auth에 위치해야 하나 shared/api에서 필요해 shared/lib에 위치
// 대안으로 app 레이어 provider 주입을 고려했으나 흐름이 직관적이지 않아 제외
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthLoaded: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setIsAuthLoaded: (isAuthLoaded: boolean) => void;
}

type AuthPersist = Pick<AuthState, 'accessToken' | 'refreshToken'>;

const storage = createJSONStorage<AuthPersist>(() => ({
  getItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
}));

const authPersist = persist(
  (set, get) => ({
    accessToken: null,
    refreshToken: null,
    isAuthLoaded: false,
    setAccessToken: (accessToken: string | null) => set({ accessToken }),
    setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
    setIsAuthLoaded: (isAuthLoaded: boolean) => set({ isAuthLoaded }),
  }),
  {
    name: 'auth-store',
    partialize: (state: AuthState): AuthPersist => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
    storage,
    onRehydrateStorage: (state) => {
      return () => state.setIsAuthLoaded(true);
    },
  },
);

const authStoreCreator: StateCreator<AuthState, [], [['zustand/persist', AuthPersist]]> = __DEV__
  ? (devtools(authPersist, { name: 'auth-store' }) as StateCreator<
      AuthState,
      [],
      [['zustand/persist', AuthPersist]]
    >)
  : authPersist;

export const useAuthStore = create<AuthState>()(authStoreCreator);

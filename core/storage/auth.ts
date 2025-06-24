import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

export const authManager = {
  getAccessToken: async () => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return accessToken;
  },
  hasAccessToken: async () => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!accessToken;
  },
  saveAccessToken: async (accessToken: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  removeAccessToken: async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  },
  saveRefreshToken: async (refreshToken: string) => {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  removeRefreshToken: async () => {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  getTokens: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem(ACCESS_TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN_KEY),
    ]);
    return { accessToken, refreshToken };
  },
  saveTokens: async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    await Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },
  removeTokens: async () => {
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    ]);
  },
};

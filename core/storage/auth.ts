import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';

const authManager = {
  getAccessToken: async () => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return accessToken;
  },
  hasAccessToken: async () => {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!accessToken;
  },
  setAccessToken: async (accessToken: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  getRefreshToken: async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
    return refreshToken;
  },
  setRefreshToken: async (refreshToken: string) => {
    await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
  },
  getTokens: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem(ACCESS_TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN),
    ]);
    return { accessToken, refreshToken };
  },
  setTokens: async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    await Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN, refreshToken),
    ]);
  },
  clearTokens: async () => {
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN),
    ]);
  },
};

export default authManager;

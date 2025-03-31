import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

export const authManager = {
  getAccessToken: async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  },

  setAccessToken: async (token: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken: async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

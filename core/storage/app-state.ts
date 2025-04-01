import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = 'FIRST_LAUNCH';

export const appStateManager = {
  checkFirstLaunch: async () => {
    const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return isFirstLaunch === null;
  },
  markFirstLaunch: async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
  },
  clearFirstLaunch: async () => {
    await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
  },
};

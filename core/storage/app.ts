import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = 'FIRST_LAUNCH';
const ALARM_ON_KEY = 'ALARM_ON';
const VISITED_KEY = 'VISITED';

export const appManager = {
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
  checkAlarmOn: async () => {
    const alarmOn = await AsyncStorage.getItem(ALARM_ON_KEY);
    return alarmOn === 'true';
  },
  markAlarmOn: async () => {
    await AsyncStorage.setItem(ALARM_ON_KEY, 'true');
  },
  clearAlarmOn: async () => {
    await AsyncStorage.removeItem(ALARM_ON_KEY);
  },
  hasVisited: async () => {
    const hasVisited = await AsyncStorage.getItem(VISITED_KEY);
    return hasVisited === 'true';
  },
  markVisited: async () => {
    await AsyncStorage.setItem(VISITED_KEY, 'true');
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_FIRST_VISIT_KEY = 'isFirstVisit';

export async function getIsFirstVisit(): Promise<boolean> {
  const storedValue = await AsyncStorage.getItem(IS_FIRST_VISIT_KEY);
  if (storedValue === null) {
    return true;
  }
  return storedValue === 'true';
}

export async function setIsFirstVisit(value: boolean): Promise<void> {
  await AsyncStorage.setItem(IS_FIRST_VISIT_KEY, value ? 'true' : 'false');
}

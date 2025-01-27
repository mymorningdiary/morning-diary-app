import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageClient {
  private constructor() {} // NOTE: new SessionManager()와 같은 방식으로 클래스의 인스턴스를 생성하는 것을 막음. Static Utility Class 패턴

  static async getItem<T>(key: string): Promise<T[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error(`Error getting item from AsyncStorage with key ${key}`, error);
      return [];
    }
  }

  static async saveItem<T>(key: string, item: T): Promise<void> {
    try {
      const currentItems = await this.getItem<T>(key);
      const updatedItems = [...currentItems, item];

      await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
    } catch (error) {
      console.error(`Error saving item to AsyncStorage with key ${key}`, error);
    }
  }

  static async removeItem<T>(key: string, item?: T): Promise<void> {
    try {
      if (item !== undefined) {
        const currentItems = await this.getItem<T>(key);

        const updatedItems = currentItems.filter((existingItem) => existingItem !== item);

        await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing item from AsyncStorage with key ${key}`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  }

  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from AsyncStorage', error);
      return [];
    }
  }
}

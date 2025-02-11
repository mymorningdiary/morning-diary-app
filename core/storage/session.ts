import { StorageKey } from '@/constants/utils';
import { Nullable } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionInfo {
  accessToken: Nullable<string>;
}

export class SessionManager {
  private constructor() {} // NOTE: new SessionManager()와 같은 방식으로 클래스의 인스턴스를 생성하는 것을 막음. Static Utility Class 패턴

  public static async getSessionInfo(): Promise<SessionInfo> {
    const accessToken = await AsyncStorage.getItem(StorageKey.ACCESS_TOKEN);

    return {
      accessToken,
    };
  }

  public static async setSessionInfo({ accessToken }: { accessToken: string }): Promise<void> {
    await AsyncStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
  }

  public static async clearSessionInfo(): Promise<void> {
    await AsyncStorage.removeItem(StorageKey.ACCESS_TOKEN);
  }

  public static async isFirstLaunch(): Promise<boolean> {
    const isFirstLaunch = await AsyncStorage.getItem(StorageKey.IS_FIRST_LAUNCH);
    return isFirstLaunch === null;
  }

  public static async setIsFirstLaunch(): Promise<void> {
    await AsyncStorage.setItem(StorageKey.IS_FIRST_LAUNCH, 'false');
  }
}

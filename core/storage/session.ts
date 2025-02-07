import { StorageKey } from '@/constants/utils';
import { Nullable } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionInfo {
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  expiredAt: Nullable<number>;
}

export class SessionManager {
  private constructor() {} // NOTE: new SessionManager()와 같은 방식으로 클래스의 인스턴스를 생성하는 것을 막음. Static Utility Class 패턴

  public static async getSessionInfo(): Promise<SessionInfo> {
    const [accessToken, refreshToken, expiredAt] = await Promise.all([
      AsyncStorage.getItem(StorageKey.ACCESS_TOKEN),
      AsyncStorage.getItem(StorageKey.REFRESH_TOKEN),
      AsyncStorage.getItem(StorageKey.EXPIRED_AT),
    ]);

    return {
      accessToken,
      refreshToken,
      expiredAt: expiredAt ? parseInt(expiredAt, 10) : null,
    };
  }

  public static async setSessionInfo({
    accessToken,
    refreshToken,
    expiredAt,
  }: {
    accessToken: string;
    refreshToken?: string;
    expiredAt?: number;
  }): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken),
      // AsyncStorage.setItem(StorageKey.REFRESH_TOKEN, refreshToken),
      // AsyncStorage.setItem(StorageKey.EXPIRED_AT, expiredAt.toString()),
    ]);
  }

  public static async clearSessionInfo(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(StorageKey.ACCESS_TOKEN),
      // AsyncStorage.removeItem(StorageKey.REFRESH_TOKEN),
      // AsyncStorage.removeItem(StorageKey.EXPIRED_AT),
    ]);
  }

  public static async isSessionExpired(): Promise<boolean> {
    const { expiredAt } = await SessionManager.getSessionInfo();
    return !expiredAt || Date.now() >= expiredAt;
  }

  public static async isFirstLaunch(): Promise<boolean> {
    const isFirstLaunch = await AsyncStorage.getItem(StorageKey.IS_FIRST_LAUNCH);
    return isFirstLaunch === null;
  }

  public static async setIsFirstLaunch(): Promise<void> {
    await AsyncStorage.setItem(StorageKey.IS_FIRST_LAUNCH, 'false');
  }
}

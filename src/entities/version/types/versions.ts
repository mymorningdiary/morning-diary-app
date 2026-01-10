export interface AppVersion {
  android: {
    version: string;
    minVersion: string;
  };
  ios: {
    version: string;
    minVersion: string;
  };
}

export type VersionStatus = 'ok' | 'warn' | 'force';

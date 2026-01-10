import { Platform } from 'react-native';
import { AppVersion, VersionStatus } from '../types/versions';
import * as Application from 'expo-application';
import { Logger } from '@shared/lib/log';
import semver from 'semver';

export function compareAppVersion(appVersion: AppVersion): VersionStatus {
  try {
    // 서버 버전 정보
    const { android, ios } = appVersion;
    const remoteVersion = Platform.select({
      android: android.version,
      ios: ios.version,
      default: null,
    });
    const remoteMinVersion = Platform.select({
      android: android.minVersion,
      ios: ios.minVersion,
      default: null,
    });

    // 사용자 앱 버전
    const localVersion = Application.nativeApplicationVersion;
    if (localVersion === null) return 'ok';

    Logger('AppState').debug(
      'remote',
      {
        version: remoteVersion,
        minVersion: remoteMinVersion,
      },
      'local',
      {
        version: localVersion,
      },
    );

    // 강제 업데이트 확인 (최소 버전보다 앱 버전이 낮다면)
    if (remoteMinVersion && semver.lt(localVersion, remoteMinVersion)) {
      return 'force';
    }

    // 선택 업데이트 확인 (최신 버전보다 앱 버전이 낮다면)
    if (remoteVersion && semver.lt(localVersion, remoteVersion)) {
      return 'warn';
    }

    return 'ok';
  } catch (e) {
    Logger('AppStateProvider').error('Failed to compare version', e);
    return 'ok';
  }
}

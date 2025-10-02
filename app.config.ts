import { ConfigContext, ExpoConfig } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.mymorningdiary.morningdiary.dev';
  }

  if (IS_PREVIEW) {
    return 'com.mymorningdiary.morningdiary.preview';
  }

  return 'com.mymorningdiary.morningdiary';
};

const getAppName = () => {
  if (IS_DEV) {
    return '아침일기 (Dev)';
  }

  if (IS_PREVIEW) {
    return '아침일기 (Preview)';
  }

  return '아침일기';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: 'morning-diary',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/ic-app.png',
  scheme: 'morningdiary',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    appleTeamId: '53RC4S4AT2',
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/ic-adaptive-app.png',
      backgroundColor: '#ffffff',
    },
    package: getUniqueIdentifier(),
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/img-splash.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    'expo-notifications',
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission: 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '295098dc-51af-4553-b9ca-a7bbf5514d8c',
    },
  },
  owner: 'morning-diary',
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/295098dc-51af-4553-b9ca-a7bbf5514d8c',
  },
});

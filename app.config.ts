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
  version: '1.0.2',
  orientation: 'portrait',
  icon: './assets/images/ic-app.png',
  scheme: 'morningdiary',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: getUniqueIdentifier(),
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    appleTeamId: '53RC4S4AT2',
    config: {
      usesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
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
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Pretendard-Bold.ttf',
          './assets/fonts/Pretendard-SemiBold.ttf',
          './assets/fonts/Pretendard-Medium.ttf',
          './assets/fonts/Pretendard-Regular.ttf',
          './assets/fonts/Roboto-Regular.ttf',
          './assets/fonts/Inter-Regular.ttf',
        ],
        android: {
          fonts: [
            {
              fontFamily: 'Pretendard',
              fontDefinitions: [
                {
                  path: './assets/fonts/Pretendard-Regular.ttf',
                  weight: 400,
                  style: 'normal',
                },
                {
                  path: './assets/fonts/Pretendard-Medium.ttf',
                  weight: 500,
                  style: 'normal',
                },
                {
                  path: './assets/fonts/Pretendard-SemiBold.ttf',
                  weight: 600,
                  style: 'normal',
                },
                {
                  path: './assets/fonts/Pretendard-Bold.ttf',
                  weight: 700,
                  style: 'normal',
                },
              ],
            },
            {
              fontFamily: 'Roboto',
              fontDefinitions: [
                {
                  path: './assets/fonts/Roboto-Regular.ttf',
                  weight: 400,
                  style: 'normal',
                },
              ],
            },
            {
              fontFamily: 'Inter',
              fontDefinitions: [
                {
                  path: './assets/fonts/Inter-Regular.ttf',
                  weight: 400,
                  style: 'normal',
                },
              ],
            },
          ],
        },
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    'expo-apple-authentication',
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
    appVariant: process.env.APP_VARIANT,
  },
  owner: 'morning-diary',
  runtimeVersion: '1.0.2', // OTA 호환성 버전, JS만 수정 -> 버전 그대로 / 패키지 설치 등 -> 버전 수정
  updates: {
    url: 'https://u.expo.dev/295098dc-51af-4553-b9ca-a7bbf5514d8c',
  },
});

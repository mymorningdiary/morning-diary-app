import Constants from 'expo-constants';

export const appVariant: 'development' | 'preview' | 'production' =
  Constants.expoConfig?.extra?.appVariant ?? 'production';

export const isDevelopment = appVariant === 'development';
export const isPreview = appVariant === 'preview';
export const isProduction = appVariant === 'production';

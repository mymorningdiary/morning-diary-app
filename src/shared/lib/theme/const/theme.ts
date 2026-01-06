import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { MDColors } from './colors';

export const MDLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    custom: MDColors.light,
  },
} as const;

export const MDDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    custom: MDColors.dark,
  },
} as const;

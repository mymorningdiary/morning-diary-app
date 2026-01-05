import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from './colors';

export const MDLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    custom: Colors.light,
  },
} as const;

export const MDDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    custom: Colors.dark,
  },
} as const;

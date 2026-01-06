import { MDColorsType } from './colors';
import { Theme } from '@react-navigation/native';

export type MDThemeType = Theme & {
  colors: MDColorsType;
};

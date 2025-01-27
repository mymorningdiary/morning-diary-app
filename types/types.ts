import { Colors } from '@/constants/colors';
import { Theme } from '@react-navigation/native';

export type Nullable<T> = T | null; // null을 허용하는 타입

export type Optional<T> = T | undefined; // undefined를 허용하는 타입

export type Maybe<T> = T | null | undefined; // null과 undefined 모두 허용하는 타입

export type MDColors = typeof Colors.light | typeof Colors.dark;

export type MDTheme = Theme & {
  colors: MDColors;
  primary: {
    normal: string;
    light: string;
    softer: string;
    faint: string;
  };
  background: {
    normal: string;
  };
  text: {
    normal: string;
    strong: string;
    alternative: string;
    inversion: string;
  };
  line: {
    normal: string;
    alternative: string;
  };
  fill: {
    normal: string;
    brand: string;
    alternative: string;
  };
  icon: {
    normal: string;
    alternative: string;
    inversion: string;
  };
};

import { MDFonts } from '../const/typography';

export type MDFontFamily = {
  fontFamily: 'Pretendard' | 'Roboto' | 'Inter';
  fontWeight: 700 | 600 | 500 | 400 | 400 | 400;
};

export type MDFontsType = keyof typeof MDFonts;

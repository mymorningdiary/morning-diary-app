import { MDFonts } from '../const/typography';

export type MDFontFamily = {
  fontFamily: 'Pretendard' | 'Roboto' | 'Inter' | 'OngleLeafRadioPen';
  fontWeight: 700 | 600 | 500 | 400;
};

export type MDFontsType = keyof typeof MDFonts;

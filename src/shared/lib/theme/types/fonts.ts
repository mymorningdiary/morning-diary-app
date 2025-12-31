import { Typography } from '../const/typography';

export type FontFamily = {
  fontFamily: 'Pretendard' | 'Roboto' | 'Inter';
  fontWeight: 700 | 600 | 500 | 400 | 400 | 400;
};

export type MDTypography = keyof typeof Typography;

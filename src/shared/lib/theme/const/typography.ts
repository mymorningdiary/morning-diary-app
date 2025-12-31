import { FontFamily } from '@/types/types';

const PretendardBold: FontFamily = {
  fontFamily: 'Pretendard',
  fontWeight: 700,
};

const PretendardSemiBold: FontFamily = {
  fontFamily: 'Pretendard',
  fontWeight: 600,
};

const PretendardMedium: FontFamily = {
  fontFamily: 'Pretendard',
  fontWeight: 500,
};

const PretendardRegular: FontFamily = {
  fontFamily: 'Pretendard',
  fontWeight: 400,
};

const RobotoRegular: FontFamily = {
  fontFamily: 'Roboto',
  fontWeight: 400,
};

const InterRegular: FontFamily = {
  fontFamily: 'Inter',
  fontWeight: 400,
};

export const Typography = {
  heading1Medium: {
    ...PretendardMedium,
    fontSize: 24,
    lineHeight: 30,
  },
  heading2SemiBold: {
    ...PretendardSemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  titleMedium: {
    ...PretendardMedium,
    fontSize: 18,
    lineHeight: 26,
  },
  titleSemiBold: {
    ...PretendardSemiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  bodyBold: {
    ...PretendardBold,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySemiBold: {
    ...PretendardSemiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyRegular: {
    ...PretendardRegular,
    fontSize: 16,
    lineHeight: 26,
  },

  labelRegular: {
    ...PretendardRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  labelSemiBold: {
    ...PretendardSemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  numberRegular: {
    ...RobotoRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  caption1SemiBold: {
    ...PretendardSemiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  caption1Medium: {
    ...PretendardMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  caption1Regular: {
    ...PretendardRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  caption2Regular: {
    ...InterRegular,
    fontSize: 11,
    lineHeight: 13,
  },
  caption2Bold: {
    ...PretendardBold,
    fontSize: 11,
    lineHeight: 13,
  },
} as const;

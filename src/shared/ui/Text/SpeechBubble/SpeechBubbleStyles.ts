import { StyleSheet, ViewStyle } from 'react-native';

import { MDColorsType, MDFontsType } from '@shared/lib/theme';

export type SpeechBubbleVariant = 'default' | 'small';

interface SpeechBubbleTriangleSize {
  borderLeftWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
}

interface SpeechBubbleVariantConfig {
  textType: MDFontsType;
  content: ViewStyle;
  triangle: SpeechBubbleTriangleSize;
  triangleBorder: SpeechBubbleTriangleSize;
}

export interface SpeechBubbleColorTokens {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

const speechBubbleVariantConfigMap: Record<SpeechBubbleVariant, SpeechBubbleVariantConfig> = {
  default: {
    textType: 'labelSemiBold',
    content: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    triangle: {
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderBottomWidth: 12,
    },
    triangleBorder: {
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 14,
    },
  },
  small: {
    textType: 'caption2Bold',
    content: {
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    triangle: {
      borderLeftWidth: 4.5,
      borderRightWidth: 4.5,
      borderBottomWidth: 7,
    },
    triangleBorder: {
      borderLeftWidth: 5.5,
      borderRightWidth: 5.5,
      borderBottomWidth: 9,
    },
  },
};

export const SpeechBubbleBaseStyles = StyleSheet.create({
  content: {
    borderRadius: 24,
    borderWidth: 1,
  },
  triangleContent: {
    alignItems: 'center',
    position: 'relative',
    marginTop: -1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
  triangleBorder: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
});

export const getSpeechBubbleColorTokens = (colors: MDColorsType): SpeechBubbleColorTokens => ({
  backgroundColor: colors.fill.normal,
  borderColor: colors.line.alternative,
  textColor: colors.text.brand,
});

export const getSpeechBubbleVariantConfig = (variant: SpeechBubbleVariant) =>
  speechBubbleVariantConfigMap[variant];

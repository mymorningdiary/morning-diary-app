import { StyleSheet, ViewStyle } from 'react-native';

import { MDColorsType, MDFontsType } from '@shared/lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonVariantToken {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface ButtonContentToken {
  textType: MDFontsType;
  iconSize: number;
  iconSpacing: number;
}

interface ButtonSizeConfig {
  container: ViewStyle;
  content: ButtonContentToken;
}

const buttonSizeConfigMap: Record<ButtonSize, ButtonSizeConfig> = {
  large: {
    container: {
      minHeight: 52,
      paddingHorizontal: 20,
      borderRadius: 18,
    },
    content: {
      textType: 'bodySemiBold',
      iconSize: 28,
      iconSpacing: 8,
    },
  },
  medium: {
    container: {
      minHeight: 48,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    content: {
      textType: 'bodyRegular',
      iconSize: 24,
      iconSpacing: 6,
    },
  },
  small: {
    container: {
      minHeight: 44,
      paddingHorizontal: 12,
      borderRadius: 14,
    },
    content: {
      textType: 'labelSemiBold',
      iconSize: 16,
      iconSpacing: 4,
    },
  },
};

export const ButtonBaseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
});

const getVariantTokensMap = (colors: MDColorsType): Record<ButtonVariant, ButtonVariantToken> => ({
  primary: {
    backgroundColor: colors.primary.normal,
    textColor: colors.text.inversion,
    iconColor: colors.icon.inversion,
    borderColor: 'transparent',
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.fill.normal,
    textColor: colors.text.brand,
    iconColor: colors.icon.normal,
    borderColor: colors.line.alternative,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: colors.text.brand,
    iconColor: colors.icon.normal,
    borderColor: 'transparent',
    borderWidth: 0,
  },
  outline: {
    backgroundColor: colors.fill.normal,
    textColor: colors.text.normal,
    iconColor: colors.icon.normal,
    borderColor: colors.line.alternative,
    borderWidth: 1,
  },
});

export const getVariantTokens = ({
  colors,
  variant,
  disabled,
}: {
  colors: MDColorsType;
  variant: ButtonVariant;
  disabled: boolean;
}): ButtonVariantToken => {
  if (disabled) {
    const hasBorder = variant === 'secondary' || variant === 'outline';
    return {
      backgroundColor: variant === 'ghost' ? 'transparent' : colors.fill.alternative,
      textColor: colors.text.alternative,
      iconColor: colors.icon.alternative,
      borderColor: hasBorder ? colors.line.alternative : 'transparent',
      borderWidth: hasBorder ? (variant === 'outline' ? 1 : StyleSheet.hairlineWidth) : 0,
    };
  }

  return getVariantTokensMap(colors)[variant];
};

export const getButtonSizeConfig = (size: ButtonSize) => buttonSizeConfigMap[size];

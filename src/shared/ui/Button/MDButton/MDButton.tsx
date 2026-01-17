import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

import { useThemeColor } from '@shared/lib/theme';

import {
  ButtonBaseStyles,
  ButtonSize,
  ButtonVariant,
  getButtonSizeConfig,
  getVariantTokens,
} from './MDButtonStyles';
import { MDText } from '@shared/ui/Text';

export interface MDButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  prefix?: React.FC<SvgProps>;
  suffix?: React.FC<SvgProps>;
  style?: StyleProp<ViewStyle>;
}

export function MDButton({
  label,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  loading = false,
  prefix: PrefixIcon,
  suffix: SuffixIcon,
  disabled,
  accessibilityRole,
  style,
  ...rest
}: MDButtonProps) {
  const colors = useThemeColor();
  const isDisabled = disabled ?? false;
  const { container, content } = getButtonSizeConfig(size);
  const { textType, iconSize, iconSpacing } = content;
  const variantTokens = getVariantTokens({
    colors,
    variant,
    disabled: isDisabled || loading,
  });

  return (
    <Pressable
      accessibilityRole={accessibilityRole ?? 'button'}
      disabled={isDisabled || loading}
      style={({ pressed }) => [
        ButtonBaseStyles.container,
        container,
        fullWidth && ButtonBaseStyles.fullWidth,
        {
          backgroundColor: variantTokens.backgroundColor,
          borderColor: variantTokens.borderColor,
          borderWidth: variantTokens.borderWidth,
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variantTokens.textColor} size="small" />
      ) : (
        <>
          {PrefixIcon ? (
            <View style={{ marginRight: iconSpacing }}>
              <PrefixIcon width={iconSize} height={iconSize} color={variantTokens.iconColor} />
            </View>
          ) : null}
          <MDText type={textType} color={variantTokens.textColor}>
            {label}
          </MDText>
          {SuffixIcon ? (
            <View style={{ marginLeft: iconSpacing }}>
              <SuffixIcon width={iconSize} height={iconSize} color={variantTokens.iconColor} />
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

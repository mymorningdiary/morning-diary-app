import { useThemeColor } from '@/hooks';
import { MDColors, Typography } from '@/types';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  PressableProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import MDPressable from './MDPressable';
import { MDText } from './MDText';

type MDButtonProps = PressableProps & {
  title: string;
  textType?: Typography;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  pressedOpacity?: number;
};

export function MDButton({
  title,
  style,
  textStyle,
  textType = 'bodyRegular',
  icon,
  iconStyle,
  pressedOpacity = 0.8,
  disabled,
  ...rest
}: MDButtonProps) {
  const colors = useThemeColor();
  const defaultStyles = buttonStyles({ colors, disabled: disabled ?? false });

  return (
    <MDPressable
      style={[defaultStyles.container, style]}
      pressedOpacity={pressedOpacity}
      disabled={disabled}
      {...rest}>
      {icon && <Image source={icon} style={[defaultStyles.icon, iconStyle]} />}
      <MDText type={textType} style={[defaultStyles.text, textStyle]}>
        {title}
      </MDText>
    </MDPressable>
  );
}

const buttonStyles = ({ colors, disabled }: { colors: MDColors; disabled: boolean }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled ? colors.fill.alternative : colors.primary.normal,
      gap: 8,
    },
    text: {
      color: disabled ? colors.text.normal : colors.text.inversion,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

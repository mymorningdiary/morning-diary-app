import { useThemeColor } from '@/hooks';
import { MDColors, Typography } from '@/types/types';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { MDText } from './MDText';

type MDButtonProps = TouchableOpacityProps & {
  title: string;
  textType?: Typography;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ImageSourcePropType;
  iconStyle?: ImageStyle;
};

export function MDButton({
  title,
  style,
  textStyle,
  textType = 'bodyRegular',
  icon,
  iconStyle,
  activeOpacity = 0.8,
  ...rest
}: MDButtonProps) {
  const colors = useThemeColor();
  const defaultStyles = buttonStyles(colors);

  return (
    <TouchableOpacity
      style={[defaultStyles.container, style]}
      activeOpacity={activeOpacity}
      {...rest}>
      {icon && <Image source={icon} style={[defaultStyles.icon, iconStyle]} />}
      <MDText type={textType} style={[defaultStyles.text, textStyle]}>
        {title}
      </MDText>
    </TouchableOpacity>
  );
}

const buttonStyles = (colors: MDColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary.normal,
      gap: 8,
    },
    text: {
      color: colors.text.inversion,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

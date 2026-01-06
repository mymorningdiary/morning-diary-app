import { useThemeColor } from '@/hooks';
import { MDFonts, MDFontsType } from '@shared/lib/theme';
import { Text, TextProps, TextStyle } from 'react-native';

interface Props extends TextProps {
  type?: MDFontsType;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function MDText({ style, type = 'bodyRegular', color, align, children, ...rest }: Props) {
  const { text } = useThemeColor();

  return (
    <Text
      style={[
        MDFonts[type],
        { color: color ?? text.normal },
        align !== undefined && { textAlign: align },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
}

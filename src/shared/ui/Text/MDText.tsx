import { Text, TextProps, TextStyle } from 'react-native';

import { useThemeColor } from '@/hooks';
import { MDFonts, MDFontsType } from '@shared/lib/theme';

interface MDTextProps extends TextProps {
  type?: MDFontsType;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function MDText({
  style,
  type = 'bodyRegular',
  color,
  align,
  children,
  ...rest
}: MDTextProps) {
  const { text } = useThemeColor();

  return (
    <Text
      style={[
        MDFonts[type],
        { color: color ?? text.normal },
        align !== undefined && { textAlign: align },
        style,
      ]}
      allowFontScaling={false}
      {...rest}>
      {children}
    </Text>
  );
}

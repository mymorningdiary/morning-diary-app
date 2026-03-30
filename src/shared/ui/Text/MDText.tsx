import { Text, TextProps, TextStyle } from 'react-native';

import { MDFonts, MDFontsType, useThemeColor } from '@shared/lib/theme';

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
      suppressHighlighting
      allowFontScaling={false}
      {...rest}>
      {children}
    </Text>
  );
}

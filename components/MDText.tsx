import { FontStyles } from '@/constants/fonts';
import { useThemeColor } from '@/hooks';
import { Typography } from '@/types';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: Typography;
  style?: StyleProp<TextStyle> | undefined;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function MDText({
  style,
  type = 'bodyRegular',
  suppressHighlighting = true,
  color,
  align,
  ...rest
}: ThemedTextProps) {
  const { text } = useThemeColor();

  return (
    <Text
      style={[{ color: color ?? text.normal, textAlign: align }, FontStyles[type], style]}
      suppressHighlighting={suppressHighlighting}
      {...rest}
    />
  );
}

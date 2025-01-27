import { FontStyles } from '@/constants/fonts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from '@/types/types';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: Typography;
  style?: StyleProp<TextStyle> | undefined;
};

export function MDText({
  style,
  type = 'bodyRegular',
  suppressHighlighting = true,
  ...rest
}: ThemedTextProps) {
  const { text } = useThemeColor();

  return (
    <Text
      style={[{ color: text.normal }, FontStyles[type], style]}
      suppressHighlighting={suppressHighlighting}
      {...rest}
    />
  );
}

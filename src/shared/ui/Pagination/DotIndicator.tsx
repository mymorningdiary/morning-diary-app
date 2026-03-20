import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  position: number;
  count: number;
}

export function DotIndicator({ style, position, count }: Props) {
  const colors = useThemeColor();
  const styles = IndicatorStyles({ colors });

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, position === i && { backgroundColor: colors.primary.normal }]}
        />
      ))}
    </View>
  );
}

const IndicatorStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.fill.alternative,
    },
  });

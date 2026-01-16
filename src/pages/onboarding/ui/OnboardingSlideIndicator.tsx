import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { StyleSheet, View } from 'react-native';
import { SLIDE_CNT } from './OnboardingPage';

interface Props {
  position: number;
}

export function OnboardingSlideIndicator({ position }: Props) {
  const colors = useThemeColor();
  const styles = IndicatorStyles({ colors });

  return (
    <View style={styles.container}>
      {Array.from({ length: SLIDE_CNT }).map((_, i) => (
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
      paddingHorizontal: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.fill.alternative,
    },
  });

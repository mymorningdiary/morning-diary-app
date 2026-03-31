import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { IconLight } from '@assets/icons';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  label?: string;
  current?: number;
  goal?: number;
}

export function LightProgressBar({ style, label = '빛 모으기', current = 0, goal = 1 }: Props) {
  const colors = useThemeColor();
  const styles = ProgressBarStyles({ colors });

  const safeGoal = Math.max(goal, 1);
  const progress = safeGoal > 0 ? Math.min(Math.max((current / safeGoal) * 100, 0), 100) : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContent}>
        <MDText type="caption2Regular" color={colors.text.brand}>
          {label}
        </MDText>

        <View style={styles.goalContent}>
          <IconLight width={12} height={12} color={colors.accent.light.collect} />

          <MDText type="caption2Regular" color={colors.text.alternative}>
            {`${current}/${goal}`}
          </MDText>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const ProgressBarStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
    },
    goalContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    track: {
      height: 4,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: colors.fill.alternative,
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.accent.light.collect,
    },
  });

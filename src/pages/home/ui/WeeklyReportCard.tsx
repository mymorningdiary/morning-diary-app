import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { LightProgressBar } from '@shared/ui/ProgressBar';

interface Props {
  style?: StyleProp<ViewStyle>;
  count?: number;
  isReportOpened?: boolean;
}

export function WeeklyReportCard({ style, count, isReportOpened }: Props) {
  const colors = useThemeColor();
  const styles = CardStyles({ colors });

  return (
    <View style={[styles.container, style]}>
      <MDText type="labelSemiBold">주간 리포트</MDText>
      <LightProgressBar current={3} goal={3} />
    </View>
  );
}

const CardStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      minWidth: 165,
      minHeight: 120,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: colors.fill.normal,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.line.normal,
      justifyContent: 'space-between',
    },
  });

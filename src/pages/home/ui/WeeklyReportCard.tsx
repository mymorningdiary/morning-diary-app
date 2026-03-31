import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { LightProgressBar } from '@shared/ui/ProgressBar';

const getSubtitle = ({ count, goal }: { count: number; goal: number }) => {
  const safeGoal = Math.max(goal, 1);
  const remaining = Math.max(safeGoal - count, 0);

  if (remaining === 0) {
    return '기록 완료! 일기가 쌓이면 리포트가 더 풍성해져요';
  }

  if (remaining === 1) {
    return '마지막 1번! 일요일에 특별한 리포트를 만나보세요';
  }

  if (remaining === 2) {
    return '기분 좋은 시작! 2번 더 기록하면 무의식이 정리돼요';
  }

  return `${remaining}번만 기록하고 무의식을 확인해보세요`;
};

interface Props {
  style?: StyleProp<ViewStyle>;
  count?: number;
  goal?: number;
  isReportOpened?: boolean;
}

export function WeeklyReportCard({ style, count = 0, goal = 1, isReportOpened }: Props) {
  const colors = useThemeColor();
  const styles = CardStyles({ colors });

  const subtitle = getSubtitle({ count, goal });

  return (
    <View style={[styles.container, style]}>
      <View>
        <MDText type="labelSemiBold">주간 리포트</MDText>
        <MDText type="caption1Regular">{subtitle}</MDText>
      </View>

      <LightProgressBar current={count} goal={goal} />
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

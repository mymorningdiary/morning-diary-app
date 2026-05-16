import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { LightProgressBar } from '@shared/ui/ProgressBar';
import { MDButton } from '@shared/ui/Button';
import { useCreateWeeklyReport } from '@entities/report';
import { useToastStore } from '@shared/lib/toast';

interface WeeklyReportCardState {
  isBelowGoal: boolean;
  isGoalReachedOnWeekday: boolean;
  isGoalReachedOnSunday: boolean;
  isReportGeneratedOnSunday: boolean;
  remaining: number;
}

const getWeeklyReportCardState = ({
  count,
  goal,
  isSunday,
  isReportGenerated,
}: {
  count: number;
  goal: number;
  isSunday: boolean;
  isReportGenerated?: boolean;
}): WeeklyReportCardState => {
  const safeGoal = Math.max(goal, 1);
  const remaining = Math.max(safeGoal - count, 0);
  const isGoalReached = remaining === 0;

  return {
    isBelowGoal: !isGoalReached,
    isGoalReachedOnWeekday: isGoalReached && !isSunday,
    isGoalReachedOnSunday: isGoalReached && isSunday,
    isReportGeneratedOnSunday: isGoalReached && isSunday && Boolean(isReportGenerated),
    remaining,
  };
};

const getTitleTexts = (state: WeeklyReportCardState) => {
  if (state.isReportGeneratedOnSunday) {
    return {
      title: '이번 주, 무의식이 정리됐어요 🔍',
    };
  }

  if (state.isGoalReachedOnSunday) {
    return {
      title: '이번 주, 무의식이 도착했어요! 🎁',
    };
  }

  if (state.isGoalReachedOnWeekday) {
    return {
      title: '주간 리포트',
      subtitle: '기록 완료! 일기가 쌓이면 리포트가 더 풍성해져요',
    };
  }

  if (state.isBelowGoal && state.remaining === 1) {
    return {
      title: '주간 리포트',
      subtitle: '마지막 1번! 일요일에 특별한 리포트를 만나보세요',
    };
  }

  if (state.isBelowGoal && state.remaining === 2) {
    return {
      title: '주간 리포트',
      subtitle: '기분 좋은 시작! 2번 더 기록하면 무의식이 정리돼요',
    };
  }

  return {
    title: '주간 리포트',
    subtitle: `${state.remaining}번만 기록하고 무의식을 확인해보세요`,
  };
};

interface Props {
  style?: StyleProp<ViewStyle>;
  count?: number;
  goal?: number;
  reportId?: number | null;
}

export function WeeklyReportCard({ style, count = 0, goal = 1, reportId = null }: Props) {
  const colors = useThemeColor();
  const [isSunday, setIsSunday] = useState(() => dayjs().day() === 0);

  const { createReport, isPending } = useCreateWeeklyReport({
    onSuccess: (weeklyReportId: number) => {
      // TODO 주간 리포트 화면 이동
    },
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  useFocusEffect(
    useCallback(() => {
      setIsSunday(dayjs().day() === 0);
    }, []),
  );

  const reportState = useMemo(
    () => getWeeklyReportCardState({ count, goal, isSunday, isReportGenerated: reportId != null }),
    [isSunday, count, goal, reportId],
  );

  const { title, subtitle } = getTitleTexts(reportState);

  const handlePress = async () => {
    if (isPending) return;

    if (reportState.isGoalReachedOnSunday) {
      await createReport();
    }

    if (reportState.isReportGeneratedOnSunday) {
      // TODO 주간 리포트 화면 이동
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.fill.normal, borderColor: colors.line.normal },
        style,
      ]}>
      <View>
        {title && <MDText type="labelSemiBold">{title}</MDText>}
        {subtitle && <MDText type="caption1Regular">{subtitle}</MDText>}
      </View>

      {reportState.isBelowGoal ? (
        <LightProgressBar current={count} goal={goal} />
      ) : (
        <MDButton
          size="small"
          loading={isPending}
          label={
            reportState.isGoalReachedOnWeekday
              ? '🔒 일요일에 열려요'
              : reportState.isGoalReachedOnSunday
                ? '주간 리포트 열기'
                : '주간 리포트 보기'
          }
          disabled={reportState.isBelowGoal || reportState.isGoalReachedOnWeekday}
          onPress={handlePress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 165,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
});

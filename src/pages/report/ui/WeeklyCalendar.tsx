import { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import dayjs from 'dayjs';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { Diary } from '@entities/diary';
import { DiaryCalendarDay } from '@features/diary';

interface Props {
  style?: StyleProp<ViewStyle>;
  startDate: string;
  endDate: string;
  diaries: Diary[];
  onDayPress?: (date?: string) => void;
}

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function WeeklyCalendar({ style, startDate, endDate, diaries, onDayPress }: Props) {
  const colors = useThemeColor();

  const diaryByDate = useMemo(
    () => new Map(diaries.map((diary) => [diary.writtenDate, diary])),
    [diaries],
  );

  const dates = useMemo(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const dayCount = Math.max(end.diff(start, 'day') + 1, 0);

    return Array.from({ length: dayCount }, (_, index) => start.add(index, 'day'));
  }, [startDate, endDate]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.weekdayContent}>
        {WEEKDAY_LABELS.map((label) => {
          const labelColor =
            label === '토' ? '#007AFF' : label === '일' ? '#FF3B30' : colors.text.alternative;

          return (
            <View key={label} style={styles.cellBox}>
              <MDText type="labelRegular" color={labelColor}>
                {label}
              </MDText>
            </View>
          );
        })}
      </View>

      <View style={styles.dateContent}>
        {dates.map((date) => {
          const formattedDate = date.format('YYYY-MM-DD');
          const diary = diaryByDate.get(formattedDate);
          const isToday = date.isSame(dayjs(), 'day');

          return (
            <View key={formattedDate} style={styles.cellBox}>
              <DiaryCalendarDay
                date={formattedDate}
                state={isToday ? 'today' : undefined}
                emotion={diary?.emotionScore}
                onDayPress={onDayPress}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  weekdayContent: {
    flexDirection: 'row',
  },
  dateContent: {
    flexDirection: 'row',
  },
  cellBox: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

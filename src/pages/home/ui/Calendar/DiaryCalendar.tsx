import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import dayjs from 'dayjs';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { useForeground } from '@shared/lib/app-state';

import { DiaryCalendarHeader } from './DiaryCalendarHeader';

interface Props {
  date?: string;
  month?: string;
  onDateChange?: (date: string) => void;
  onMonthChange?: (date: string) => void;
  onDayPress?: (day?: DateData) => void;
}

export function DiaryCalendar({
  date = dayjs().format('YYYY-MM-DD'),
  month = dayjs().format('YYYY-MM-DD'),
  onDateChange,
  onMonthChange,
  onDayPress,
}: Props) {
  const colors = useThemeColor();
  const styles = CalendarStyles({ colors });

  const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));

  useForeground(() => {
    setToday(dayjs().format('YYYY-MM-DD'));
  });

  useFocusEffect(
    useCallback(() => {
      setToday(dayjs().format('YYYY-MM-DD'));
    }, []),
  );

  const handleMonthChange = (date: DateData) => {
    onMonthChange?.(date.dateString);
  };

  return (
    <Calendar
      style={styles.container}
      initialDate={month}
      maxDate={today}
      monthFormat={'yyyy년 MM월'}
      renderHeader={() => <DiaryCalendarHeader month={month} onMonthChange={onMonthChange} />}
      hideArrows
      disableAllTouchEventsForDisabledDays
      enableSwipeMonths
      onMonthChange={handleMonthChange}
    />
  );
}

const CalendarStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.normal,
    },
  });

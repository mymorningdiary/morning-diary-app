import dayjs from 'dayjs';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { useForeground } from '@shared/lib/app-state';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';

import { DiaryCalendarDay } from './DiaryCalendarDay';
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
      theme={{
        calendarBackground: colors.background.normal,
      }}
      initialDate={month}
      maxDate={today}
      renderHeader={() => <DiaryCalendarHeader month={month} onMonthChange={onMonthChange} />}
      dayComponent={({ date, state, marking }) => (
        <DiaryCalendarDay date={date?.dateString} state={state} />
      )}
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

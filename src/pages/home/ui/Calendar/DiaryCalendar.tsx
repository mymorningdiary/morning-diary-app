import dayjs from 'dayjs';
import { StyleSheet } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { MDColorsType, MDFonts, useThemeColor } from '@shared/lib/theme';

import { DiaryCalendarDay } from './DiaryCalendarDay';
import { DiaryCalendarHeader } from './DiaryCalendarHeader';
import { MarkedDates } from './types';

LocaleConfig.defaultLocale = 'kr';

interface Props {
  date?: string;
  month?: string;
  markedDates?: MarkedDates;
  onDateChange?: (date: string) => void;
  onMonthChange?: (date: string) => void;
  onDayPress?: (day?: DateData) => void;
}

export function DiaryCalendar({
  date = dayjs().format('YYYY-MM-DD'),
  month = dayjs().format('YYYY-MM-DD'),
  markedDates,
  onMonthChange,
}: Props) {
  const colors = useThemeColor();
  const styles = CalendarStyles({ colors });

  const handleMonthChange = (date: DateData) => {
    onMonthChange?.(date.dateString);
  };

  return (
    <Calendar
      theme={{
        calendarBackground: colors.background.normal,
        // @ts-ignore
        'stylesheet.calendar.header': {
          dayTextAtIndex0: {
            ...MDFonts['labelRegular'],
            color: colors.text.normal,
          },
          dayTextAtIndex1: {
            ...MDFonts['labelRegular'],
            color: colors.text.normal,
          },
          dayTextAtIndex2: {
            ...MDFonts['labelRegular'],
            color: colors.text.normal,
          },
          dayTextAtIndex3: {
            ...MDFonts['labelRegular'],
            color: colors.text.normal,
          },
          dayTextAtIndex4: {
            ...MDFonts['labelRegular'],
            color: colors.text.normal,
          },
          dayTextAtIndex5: {
            ...MDFonts['labelRegular'],
            color: 'blue',
          },
          dayTextAtIndex6: {
            ...MDFonts['labelRegular'],
            color: 'red',
          },
        },
      }}
      initialDate={month}
      firstDay={1}
      markedDates={markedDates}
      renderHeader={() => <DiaryCalendarHeader month={month} onMonthChange={onMonthChange} />}
      dayComponent={(props) => {
        // console.log(props);
        return (
          <DiaryCalendarDay
            date={props.date?.dateString}
            state={props.state}
            // @ts-ignore
            emotion={props.marking?.emotion}
          />
        );
      }}
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

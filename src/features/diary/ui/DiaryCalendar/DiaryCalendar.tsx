import dayjs from 'dayjs';
import { StyleSheet } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { MDColorsType, MDFonts, useThemeColor } from '@shared/lib/theme';

import { DiaryCalendarDay } from './DiaryCalendarDay';
import { DiaryCalendarHeader } from './DiaryCalendarHeader';
import { MarkedDates } from '../../model/types';

LocaleConfig.defaultLocale = 'kr';

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};

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
        weekVerticalMargin: 0,
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

import dayjs from 'dayjs';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { MDFonts, useThemeColor } from '@shared/lib/theme';

import { DatePicker } from '@shared/ui/Picker';
import { MarkedDates } from '../../model/types';
import { DiaryCalendarDay } from './DiaryCalendarDay';

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
  markedDates?: MarkedDates | null;
  onDateChange?: (date: string) => void;
  onDayPress?: (date?: string) => void;
  onHeaderPress?: () => void;
}

export function DiaryCalendar({
  date = dayjs().format('YYYY-MM-DD'),
  markedDates,
  onDateChange,
  onDayPress,
  onHeaderPress,
}: Props) {
  const colors = useThemeColor();

  const handleMonthChange = (date: DateData) => {
    onDateChange?.(date.dateString);
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
            color: '#529deeff',
          },
          dayTextAtIndex6: {
            ...MDFonts['labelRegular'],
            color: '#f8544bff',
          },
        },
      }}
      initialDate={date}
      firstDay={1}
      markedDates={markedDates ?? {}}
      renderHeader={() => <DatePicker date={date} onDateChange={onDateChange} />}
      dayComponent={(props) => {
        // console.log(props);
        return (
          <DiaryCalendarDay
            date={props.date?.dateString}
            state={props.state}
            // @ts-ignore
            emotion={props.marking?.emotion}
            onDayPress={onDayPress}
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

import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { MDColors } from '@/types';
import { formatCalendarDate, formatCalendarHeaderDate } from '@/utils/dates';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks';
import { DayProps } from 'react-native-calendars/src/calendar/day';
import { MDView } from '../MDView';
import { MDText } from '../MDText';

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

LocaleConfig.defaultLocale = 'kr';

type MarkedDate = {
  [key: string]: {
    selected: boolean;
    marked: boolean;
  };
};

type MainCalendarProps = {
  markedDates: MarkedDate;
  onMonthChange: (month: DateData) => void;
  onDayPress: (day?: DateData) => void;
};

export default function MainCalendar({
  markedDates,
  onMonthChange,
  onDayPress,
}: MainCalendarProps) {
  const colors = useThemeColor();
  const styles = calendarStyles({ colors });
  const today = formatCalendarDate();

  return (
    <Calendar
      style={styles.container}
      theme={{
        calendarBackground: colors.background.normal,
      }}
      initialDate={formatCalendarDate()}
      minDate={undefined}
      maxDate={today}
      onDayPress={onDayPress}
      monthFormat={'yyyy MM'}
      onMonthChange={onMonthChange}
      markedDates={markedDates}
      renderHeader={(date: string) => <CalendarHeader date={date} />}
      dayComponent={({ date, state, marking }: DayProps & { date?: DateData }) => (
        <CalendarDay
          date={date}
          state={state}
          marking={marking}
          onPress={(date) => onDayPress(date)}
        />
      )}
      hideArrows={true}
      hideExtraDays={true}
      firstDay={0}
      hideDayNames={false}
      showWeekNumbers={false}
      disableAllTouchEventsForDisabledDays={true}
      enableSwipeMonths={true}
    />
  );
}

const calendarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.normal,
      paddingHorizontal: 12,
    },
    dayContainer: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      gap: 2,
    },
    dayText: {
      fontFamily: 'Roboto-Regular',
      color: colors.text.brand,
      fontSize: 13,
      lineHeight: 18,
    },
    mark: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary.normal,
    },
  });

type CalendarHeaderProps = {
  date: string;
};

const CalendarHeader = ({ date }: CalendarHeaderProps) => {
  const colors = useThemeColor();
  const styles = headerStyles({ colors });

  return (
    <MDView style={styles.container}>
      <MDText>{formatCalendarHeaderDate(date)}</MDText>
    </MDView>
  );
};

const headerStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {},
  });

type CalendarDayProps = DayProps & {
  date?: DateData;
  onPress: (date?: DateData) => void;
};

const CalendarDay = ({ date, state, marking, onPress }: CalendarDayProps) => {
  const colors = useThemeColor();
  const styles = dayStyles({ colors });
  const isToday = state === 'today';
  const isSelected = marking?.selected;
  const isMarked = marking?.marked;
  const isDisabled = state === 'disabled';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && {
          borderRadius: 100,
          borderWidth: 1,
          borderColor: colors.line.normal,
        },
        isToday && {
          backgroundColor: colors.primary.softer,
          borderWidth: 0,
        },
      ]}
      onPress={() => onPress(date)}
      disabled={isDisabled}>
      <MDView style={styles.placeholderMark} />
      <MDText
        type="numberRegular"
        style={[
          styles.text,
          isDisabled && { color: colors.text.alternative },
          isSelected && {
            color: colors.text.brand,
          },
          isToday && {
            color: colors.primary.normal,
          },
        ]}>
        {date?.day}
      </MDText>
      {isMarked ? <MDView style={styles.mark} /> : <MDView style={styles.placeholderMark} />}
    </TouchableOpacity>
  );
};

const dayStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    text: {
      color: colors.text.brand,
    },
    markContainer: {
      height: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 1,
    },
    mark: {
      width: 4,
      height: 4,
      borderRadius: 100,
      backgroundColor: colors.primary.normal,
    },
    placeholderMark: {
      width: 4,
      height: 4,
      opacity: 0,
    },
  });

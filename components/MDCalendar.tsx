import { Calendar } from 'react-native-calendars';
import { MDColors } from '@/types';
import { formatCalendarDate, formatCalendarHeaderDate } from '@/utils/dates';
import { MDView, MDText } from '@/components';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks';

export const MDCalendar = () => {
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
      onDayPress={(day) => {
        console.log('selected day', day);
      }}
      monthFormat={'yyyy MM'}
      onMonthChange={(month) => {
        console.log('month changed', month);
      }}
      markedDates={{
        ['2025-03-10']: {
          selected: true,
          marked: false,
        },
        ['2025-03-09']: {
          selected: false,
          marked: true,
        },
        ['2025-03-08']: {
          selected: true,
          marked: true,
        },
      }}
      renderHeader={(date: string) => <CalendarHeader date={date} />}
      dayComponent={({ date, state, marking }: DayProps) => (
        <Day date={date} state={state} marking={marking} />
      )}
      hideArrows={true}
      hideExtraDays={true}
      firstDay={1}
      hideDayNames={false}
      showWeekNumbers={false}
      disableAllTouchEventsForDisabledDays={true}
      enableSwipeMonths={true}
    />
  );
};

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

type DayProps = {
  date: {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
  };
  state?: 'today' | 'disabled';
  marking?: {
    selected: boolean;
    marked: boolean;
  };
};

const Day = ({ date, state, marking }: DayProps) => {
  const colors = useThemeColor();
  const styles = dayStyles({ colors });
  const isToday = state === 'today';
  const isSelected = marking?.selected;
  const isMarked = marking?.marked;
  const isDisabled = state === 'disabled';

  return (
    <TouchableOpacity onPress={() => {}}>
      <MDView
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
        ]}>
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
          {date.day}
        </MDText>
        {isMarked && <MDView style={styles.mark} />}
      </MDView>
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
      gap: 2,
    },
    text: {
      color: colors.text.brand,
    },
    mark: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary.normal,
    },
  });

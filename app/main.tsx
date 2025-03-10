import { MDView, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCalendarDate, formatCalendarHeaderDate } from '@/utils/dates';
import { MDColors } from '@/types';
import { SpeechBubble } from '@/components';
import { Theme } from 'react-native-calendars/src/types';

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

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });
  const today = formatCalendarDate();

  return (
    <MDView style={styles.container}>
      <MainAppBar />
      <MDView style={styles.calendarWrapper}>
        <Calendar
          style={styles.calendarContainer}
          theme={{
            calendarBackground: colors.background.normal,
          }}
          // Initially visible month. Default = now
          initialDate={formatCalendarDate()} // Today Date
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={undefined}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={today}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
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
          dayComponent={({ date, state, marking }) => {
            console.log('date', date, state, marking);
            const isToday = date.dateString === today;
            const isSelected = marking?.selected;
            const isDisabled = state === 'disabled';

            return (
              <TouchableOpacity onPress={() => {}}>
                <MDView
                  style={[
                    styles.dayContainer,
                    isSelected && {
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: colors.line.normal,
                    },
                    isToday && {
                      backgroundColor: colors.primary.softer,
                      borderWidth: 0,
                    },
                  ]}>
                  <MDText
                    style={[
                      styles.dayText,
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
                </MDView>
              </TouchableOpacity>
            );
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={true}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) => (
            <MDView style={{ width: 20, height: 20 }}>
              <MDText>{direction === 'left' ? '<' : '>'}</MDText>
            </MDView>
          )}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={1}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={(addMonth) => addMonth()}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          // Replace default month and year title with custom one. the function receive a date as parameter
          renderHeader={(date) => {
            return <MDText>{formatCalendarHeaderDate(date)}</MDText>;
          }}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
        />
      </MDView>

      <SpeechBubble text="" />
      <Image source={require('@/assets/images/img-logo.png')} />
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    calendarWrapper: {},
    calendarContainer: {
      backgroundColor: colors.background.normal,
    },
    dayContainer: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    dayText: {
      fontFamily: 'Roboto-Regular',
      color: colors.text.brand,
      fontSize: 13,
      lineHeight: 18,
    },
  });

const calendarTheme = (colors: MDColors): Theme => ({
  calendarBackground: colors.background.normal,
  textSectionTitleColor: colors.background.normal,
  selectedDayBackgroundColor: colors.primary.normal,
  selectedDayTextColor: colors.text.brand,
  todayTextColor: colors.primary.normal,
  dayTextColor: colors.text.brand,
  textDisabledColor: colors.text.alternative,
  dotColor: colors.primary.normal,
  selectedDotColor: colors.text.brand,
});

function MainAppBar() {
  const colors = useThemeColor();
  const styles = appBarStyles({ colors });

  return (
    <MDView style={styles.container}>
      <Image source={require('@/assets/images/ic-list.png')} style={styles.icon} />
      <Image source={require('@/assets/images/ic-setting.png')} style={styles.icon} />
    </MDView>
  );
}

const appBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.normal,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

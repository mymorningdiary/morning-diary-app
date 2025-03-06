import { MDView, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { Calendar } from 'react-native-calendars';
import { Image, StyleSheet } from 'react-native';
import { formatCalendarDate, formatCalendarHeaderDate } from '@/utils/dates';
import { MDColors } from '@/types';
import { SpeechBubble } from '@/components';

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  return (
    <MDView style={styles.container}>
      <MainAppBar />
      <MDView style={styles.calendarWrapper}>
        <Calendar
          style={styles.calendarContainer}
          // Initially visible month. Default = now
          initialDate={formatCalendarDate()} // Today Date
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={undefined}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={undefined}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
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

      <SpeechBubble text="sdfsdfsdfsdfkjklajdfksfjksdjfkls" />
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
    },
    calendarWrapper: {},
    calendarContainer: {
      backgroundColor: colors.background.normal,
    },
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

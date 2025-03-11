import { MDView, MDText, MDCalendar } from '@/components';
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

  return (
    <MDView style={styles.container}>
      <MainAppBar />
      <MDCalendar />

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
    calendarContainer: {
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

import { MDCalendar, MDView, SpeechBubble } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { getTodayDateData } from '@/utils/dates';
import { useMemo, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';

const markingDays = ['2025-03-09', '2025-03-10', '2025-03-11'];

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });
  const [selectedDate, setSelectedDate] = useState<DateData>(getTodayDateData());

  const handleDayPress = (date?: DateData) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const markedDates = useMemo(() => {
    const markings = Object.fromEntries(
      markingDays.map((date) => [date, { selected: false, marked: true }]),
    );

    return {
      ...markings,
      [selectedDate.dateString]: {
        selected: true,
        marked: markingDays.includes(selectedDate.dateString),
      },
    };
  }, [selectedDate]);

  return (
    <MDView style={styles.container}>
      <MainAppBar />
      <MDCalendar markedDates={markedDates} onMonthChange={() => {}} onDayPress={handleDayPress} />
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

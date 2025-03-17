import { MDCalendar, MDView, SpeechBubble } from '@/components';
import { useGetDiaries, useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { getTodayDateData } from '@/utils/dates';
import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });
  const [selectedDate, setSelectedDate] = useState<DateData>(getTodayDateData());
  const { writtenDates, diaryInfos, handleMonthChange } = useGetDiaries();

  useEffect(() => {
    console.log(writtenDates);
  }, [writtenDates]);

  const handleDayPress = (date?: DateData) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const markedDates = useMemo(() => {
    const markings = Object.fromEntries(
      writtenDates.map((date) => [date, { selected: false, marked: true }]),
    );

    return {
      ...markings,
      [selectedDate.dateString]: {
        selected: true,
        marked: writtenDates.includes(selectedDate.dateString),
      },
    };
  }, [selectedDate, writtenDates]);

  return (
    <MDView style={styles.container}>
      <MainAppBar />
      <MDCalendar
        markedDates={markedDates}
        onMonthChange={handleMonthChange}
        onDayPress={handleDayPress}
      />
      <MDView style={styles.emptyContainer}>
        <SpeechBubble text="아침에 흘러가는 감정들을 적어볼까요?" />
        <Image source={require('@/assets/images/img-logo.png')} />
      </MDView>
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    emptyContainer: {
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
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

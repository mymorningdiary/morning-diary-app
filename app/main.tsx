import { MDCol, MDDivider } from '@/components';
import {
  MainAppBar,
  MainCalendar,
  MainDiaryContent,
  MainWriteFloatingButton,
} from '@/components/main';
import { useUser } from '@/contexts/UserContext';
import { Diary } from '@/core/types';

import { useGetDiaries, useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { formatMonth, getTodayDateData } from '@/utils/dates';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [selectedDate, setSelectedDate] = useState<DateData>(getTodayDateData());
  const [selectedDiaryInfo, setSelectedDiaryInfo] = useState<Nullable<Diary>>(null);
  const [isTodayWritten, setIsTodayWritten] = useState(false);

  const { selectedMonth, writtenDates, diaryInfos, handleMonthChange, refetch } = useGetDiaries();
  const { user } = useUser();

  // 다른 화면에서 돌아올 때 (화면 포커스에만 반응)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  // 화면 내에서 변경될 때
  useEffect(() => {
    const today = getTodayDateData();
    if (selectedMonth !== formatMonth(today)) return;

    const _isTodayWritten = writtenDates.includes(today.dateString);
    setIsTodayWritten(_isTodayWritten);
  }, [selectedMonth, writtenDates]);

  const baseMarkings = useMemo(() => {
    return Object.fromEntries(
      writtenDates.map((date) => [date, { selected: false, marked: true }]),
    );
  }, [writtenDates]);

  const markedDates = useMemo(() => {
    return {
      ...baseMarkings,
      [selectedDate.dateString]: {
        ...baseMarkings[selectedDate.dateString],
        selected: true,
      },
    };
  }, [selectedDate, baseMarkings]);

  const handleDayPress = (date?: DateData) => {
    if (!date) return;

    const selectedDiaryInfo =
      diaryInfos.find((diary) => diary.writtenDate === date.dateString) ?? null;

    setSelectedDate(date);
    setSelectedDiaryInfo(selectedDiaryInfo);
  };

  const handleWriteButtonPress = () => {
    if (!user) return;

    if (user.goalPage === 0) {
      router.push('/goal-page');
    } else {
      router.push('/write');
    }
  };

  return (
    <MDCol style={styles.container}>
      <MainAppBar />

      <MainCalendar
        markedDates={markedDates}
        onMonthChange={handleMonthChange}
        onDayPress={handleDayPress}
      />

      <MDDivider marginHorizontal={16} />

      <MainDiaryContent diaryInfo={selectedDiaryInfo} />

      <MainWriteFloatingButton disabled={isTodayWritten} onPress={handleWriteButtonPress} />
    </MDCol>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

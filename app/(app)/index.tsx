import { MDCol, MDDivider } from '@/components';
import {
  MainAppBar,
  MainCalendar,
  MainDiaryContent,
  MainWriteFloatingButton,
} from '@/components/main';
import { Diary } from '@/core/types';

import { useGetDiaries, useThemeColor } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors, Nullable } from '@/types';
import { formatMonth, getTodayDateData } from '@/utils/dates';
import dayjs from 'dayjs';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colors = useThemeColor();
  const styles = ScreenStyles({ colors });

  const [selectedDate, setSelectedDate] = useState<DateData>(getTodayDateData());
  const [selectedDiaryInfo, setSelectedDiaryInfo] = useState<Nullable<Diary>>(null);
  const [isTodayWritten, setIsTodayWritten] = useState(false);

  const { selectedMonth, writtenDates, diaryInfos, handleMonthChange, refetch } = useGetDiaries();
  const { textGoals } = useGetTextGoals();

  const { writtenDate } = useLocalSearchParams<{ writtenDate?: string }>();

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    if (writtenDate) {
      setCurrentDate(writtenDate);
    }
  }, [writtenDate]);

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
    setSelectedDate(date);
  };

  const handleWriteButtonPress = () => {
    const userTextGoalLength = textGoals?.find((item) => item.isUserTextGoal)?.textLength;
    if (userTextGoalLength === undefined) return;

    const todayDate = getTodayDateData();
    router.push({
      pathname: '/write-diary',
      params: {
        year: todayDate.year,
        month: todayDate.month,
        day: todayDate.day,
        textGoalLength: userTextGoalLength,
      },
    });
  };

  const onNavigateToSetting = useCallback(() => {
    router.push('/settings');
  }, []);

  const onNavigateToDiaryList = () => {
    router.push(`/diary-list?date=${selectedMonth}`);
  };

  const navigateToReadDiary = useCallback(
    (diary: Diary) => {
      const dateParam = `year=${selectedDate.year}&month=${selectedDate.month}&day=${selectedDate.day}`;
      router.push(`/read-diary?${dateParam}&diaryId=${diary.diaryId}`);
    },
    [selectedDate],
  );

  useEffect(() => {
    if (!selectedDate) return;

    const selectedDiaryInfo =
      diaryInfos.find((diary) => diary.writtenDate === selectedDate.dateString) ?? null;

    setSelectedDiaryInfo(selectedDiaryInfo);
  }, [selectedDate, diaryInfos]);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDCol style={styles.container}>
        <MainAppBar
          onNavigateToSetting={onNavigateToSetting}
          onNavigateToDiaryList={onNavigateToDiaryList}
        />

        <MainCalendar
          currentDate={currentDate}
          markedDates={markedDates}
          onMonthChange={handleMonthChange}
          onDayPress={handleDayPress}
        />

        <MDDivider style={{ marginTop: 8 }} marginHorizontal={16} />

        <MainDiaryContent diaryInfo={selectedDiaryInfo} onDiaryItemPress={navigateToReadDiary} />

        <MainWriteFloatingButton disabled={isTodayWritten} onPress={handleWriteButtonPress} />
      </MDCol>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

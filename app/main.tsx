import { DiaryContent, MainAppBar, MDCalendar, MDCol, MDDivider } from '@/components';

import { Diary } from '@/core/api';

import { useGetDiaries, useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { getTodayDateData } from '@/utils/dates';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DateData } from 'react-native-calendars';

export default function Main() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });
  const [selectedDate, setSelectedDate] = useState<DateData>(getTodayDateData());
  const [selectedDiaryInfo, setSelectedDiaryInfo] = useState<Nullable<Diary.DiaryInfo>>(null);
  const { writtenDates, diaryInfos, handleMonthChange } = useGetDiaries();

  useEffect(() => {
    console.log(writtenDates);
  }, [writtenDates]);

  const handleDayPress = (date?: DateData) => {
    if (!date) return;

    const selectedDiaryInfo =
      diaryInfos.find((diary) => diary.writtenDate === date.dateString) ?? null;

    setSelectedDate(date);
    setSelectedDiaryInfo(selectedDiaryInfo);
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
    <MDCol style={styles.container}>
      <MainAppBar />

      <MDCalendar
        markedDates={markedDates}
        onMonthChange={handleMonthChange}
        onDayPress={handleDayPress}
      />
      <MDDivider marginHorizontal={16} />

      <DiaryContent diaryInfo={selectedDiaryInfo} />
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

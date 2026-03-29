import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { WriteDiaryButton } from '@features/diary';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { DiaryCalendar } from './Calendar/DiaryCalendar';
import { Logger } from '@shared/lib/log';
import { MarkedDates } from './Calendar/types';

const dummyDiaries = [
  {
    date: '2026-03-01',
    emotion: 19,
  },
  {
    date: '2026-03-09',
    emotion: 21,
  },
  {
    date: '2026-03-12',
    emotion: 45,
  },
  {
    date: '2026-03-13',
    emotion: 46,
  },
  {
    date: '2026-03-16',
    emotion: 63,
  },
  {
    date: '2026-03-17',
    emotion: 12,
  },
  {
    date: '2026-03-21',
    emotion: 81,
  },
  {
    date: '2026-03-22',
    emotion: 82,
  },
];

export function HomePage() {
  const styles = PageStyles;

  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  const markedDates = useMemo(() => {
    return dummyDiaries.reduce((acc, diary) => {
      acc[diary.date] = {
        emotion: diary.emotion,
      };
      return acc;
    }, {} as MarkedDates);
  }, []);

  useEffect(() => {
    Logger('HomePage').debug('month:', currentMonth, ', date:', currentDate);
  }, [currentMonth, currentDate]);

  return (
    <MDPage style={styles.container}>
      <DiaryCalendar
        date={currentDate}
        month={currentMonth}
        markedDates={markedDates}
        onDateChange={setCurrentDate}
        onMonthChange={setCurrentMonth}
      />

      <WriteDiaryButton
        onPress={() => {
          router.push({
            pathname: '/diary-write',
            params: {
              date: dayjs().format('YYYY-MM-DD'),
            },
          });
        }}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

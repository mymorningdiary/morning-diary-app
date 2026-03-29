import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { WriteDiaryButton } from '@features/diary';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { DiaryCalendar } from './Calendar/DiaryCalendar';
import { Logger } from '@shared/lib/log';

export function HomePage() {
  const styles = PageStyles;

  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    Logger('HomePage').debug('month:', currentMonth, ', date:', currentDate);
  }, [currentMonth, currentDate]);

  return (
    <MDPage style={styles.container}>
      <MDText>Home Page</MDText>

      <DiaryCalendar
        date={currentDate}
        month={currentMonth}
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

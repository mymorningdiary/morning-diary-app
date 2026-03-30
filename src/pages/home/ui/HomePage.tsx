import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import dayjs from 'dayjs';

import { DiaryCalendar, WriteDiaryButton } from '@features/diary';
import { useHome } from '@features/home';
import { MDPage } from '@shared/ui/Layout';

export function HomePage() {
  const styles = PageStyles;

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');

  const { markedDates, getDiaryId } = useHome({ date: currentMonth });

  const handleDayPress = (date?: string) => {
    const diaryId = getDiaryId(date);
    if (!diaryId) return; // 쓴 일기가 없다면 pass

    router.push({
      pathname: '/diary-read',
      params: {
        date,
        diaryId,
      },
    });
  };

  return (
    <MDPage style={styles.container}>
      <DiaryCalendar
        date={currentDate}
        markedDates={markedDates}
        onDateChange={setCurrentDate}
        onDayPress={handleDayPress}
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

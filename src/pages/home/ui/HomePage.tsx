import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DiaryCalendar, WriteDiaryButton } from '@features/diary';
import { useHome } from '@features/home';
import { MDPage } from '@shared/ui/Layout';
import { WeeklyEmotionCard } from './WeeklyEmotionCard';
import { WeeklyReportCard } from './WeeklyReportCard';
import { useUser } from '@entities/user';

export function HomePage() {
  const { user } = useUser();

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');

  const { markedDates, weeklyEmotion, weeklyDiaryCount, getDiaryId } = useHome({
    date: currentMonth,
  });

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

      <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 12 }}>
        <WeeklyEmotionCard style={{ flex: 1 }} emotion={weeklyEmotion} />
        <WeeklyReportCard style={{ flex: 1 }} goal={3} count={weeklyDiaryCount} />
      </View>

      <WriteDiaryButton
        disabled={user?.todayDiaryWritten ?? false}
        onPress={() => {
          // router.push('/report');
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

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 60,
  },
});

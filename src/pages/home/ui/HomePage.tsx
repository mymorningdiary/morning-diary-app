import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DiaryCalendar, WriteDiaryButton } from '@features/diary';

import { useUser } from '@entities/user';
import { useRunOnFocusAndForeground } from '@shared/lib/app-state';
import { MDPage } from '@shared/ui/Layout';
import { WeeklyEmotionCard } from './WeeklyEmotionCard';
import { WeeklyReportCard } from './WeeklyReportCard';
import { useHomeData } from '../model/useHomeData';

export function HomePage() {
  const { user } = useUser();

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');

  const { markedDates, weeklyEmotion, weeklyDiaryCount, reportId, getDiaryId, refetchHome } =
    useHomeData({
      date: currentMonth,
    });

  useRunOnFocusAndForeground(
    useCallback(() => {
      void refetchHome();
    }, [refetchHome]),
  );

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

  const handleWriteDiaryPress = () => {
    const today = dayjs().format('YYYY-MM-DD');

    router.push({
      pathname: '/diary-write',
      params: {
        date: today,
      },
    });

    requestIdleCallback(() => {
      setCurrentDate(today);
    });
  };

  return (
    <MDPage style={styles.container}>
      <ScrollView
        style={styles.listContent}
        overScrollMode="never"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <DiaryCalendar
          date={currentDate}
          markedDates={markedDates}
          onDateChange={setCurrentDate}
          onDayPress={handleDayPress}
        />

        <View style={styles.weeklyContent}>
          <WeeklyEmotionCard style={styles.weeklyCard} emotion={weeklyEmotion} />
          <WeeklyReportCard
            style={styles.weeklyCard}
            date={dayjs(currentDate).format('YYYY-MM')}
            count={weeklyDiaryCount}
            reportId={reportId}
          />
        </View>
      </ScrollView>
      <WriteDiaryButton
        disabled={user?.todayDiaryWritten ?? false}
        onPress={handleWriteDiaryPress}
      />
    </MDPage>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 60,
  },
  listContent: {
    paddingBottom: 56 + 24, // 탭바 높이 + 패딩
  },
  weeklyContent: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  weeklyCard: {
    flex: 1,
    minWidth: 0,
  },
});

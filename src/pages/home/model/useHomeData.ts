import { useGetHome } from '@entities/home';
import { MarkedDates } from '@features/diary';
import { keepPreviousData } from '@tanstack/react-query';

interface Options {
  date: string;
}

export function useHomeData({ date }: Options) {
  const { home, refetch } = useGetHome({ date, placeholderData: keepPreviousData });
  const diaries = home?.diaries ?? null;
  const weeklyEmotion = home?.hasWrittenDiaryThisWeek
    ? (home?.weeklyAverageEmotionScore ?? null)
    : null;

  const weeklyDiaryCount = home?.weeklyDiaryCount ?? 0;
  const markedDates =
    diaries?.reduce((acc, it) => {
      acc[it.writtenDate] = {
        emotion: it.emotionScore,
      };
      return acc;
    }, {} as MarkedDates) ?? null;

  const getDiaryId = (date?: string) =>
    diaries?.find((it) => it.writtenDate === date)?.diaryId ?? null;

  return {
    diaries,
    markedDates,
    weeklyEmotion,
    weeklyDiaryCount,
    reportId: home?.reportId ?? null,
    getDiaryId,
    refetchHome: refetch,
  };
}

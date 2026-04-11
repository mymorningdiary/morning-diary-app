import { Diary, useGetDiaries } from '@entities/diary';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const WEEK_LABELS = ['첫째 주', '둘째 주', '셋째 주', '넷째 주', '다섯째 주'];

function getWeekOfMonth(date: string) {
  return Math.ceil(dayjs(date).date() / 7);
}

function getWeekLabel(week: number) {
  return WEEK_LABELS[week - 1] ?? `${week}째 주`;
}

export interface DiaryListSection {
  index: number;
  title: string;
  week: number;
  data: Diary[];
}

export function useDiaryList(date: string) {
  const { diary, isError, isLoading } = useGetDiaries(date);

  const sections = useMemo(() => {
    const diaries = diary?.diaryInfos ?? [];

    const grouped = [...diaries]
      .sort((a, b) => dayjs(b.writtenDate).valueOf() - dayjs(a.writtenDate).valueOf())
      .reduce<Record<number, Diary[]>>((acc, item) => {
        const week = getWeekOfMonth(item.writtenDate);

        if (!acc[week]) {
          acc[week] = [];
        }

        acc[week].push(item);
        return acc;
      }, {});

    return Object.entries(grouped)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([week, data], index) => {
        const weekNumber = Number(week);

        return {
          index,
          title: getWeekLabel(weekNumber),
          week: weekNumber,
          data,
        };
      });
  }, [diary?.diaryInfos]);

  return {
    sections,
    isError,
    isLoading,
  };
}

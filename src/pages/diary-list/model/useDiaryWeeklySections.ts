import { useMemo } from 'react';

import { useGetDiaries } from '@entities/diary';
import dayjs from 'dayjs';
import { DiaryWeeklySection } from './types';

export function useDiaryWeeklySections(date: string) {
  const { data, isPending, isError } = useGetDiaries(date);

  const sections = useMemo<DiaryWeeklySection[]>(() => {
    const weeks = data?.data.weeks;
    if (!weeks || weeks.length === 0) return [];

    const currentMonth = dayjs(date).format('YYYY-MM');

    return weeks
      .filter((week) => week.diaries.length > 0)
      .map((week) => {
        const startDate = dayjs(week.weekStartDate).format('M.D');
        const weekEndDate = dayjs(week.weekEndDate);
        const endDate = weekEndDate.format(
          weekEndDate.format('YYYY-MM') === currentMonth ? 'D' : 'M.D',
        );

        return {
          title: `${startDate} - ${endDate}`,
          data: [...(week.weeklyReport ? [week.weeklyReport] : []), ...week.diaries],
        };
      });
  }, [data, date]);

  return { sections, isPending, isError };
}

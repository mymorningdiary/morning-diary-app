import { Diary } from '@/core/api';
import { useApiQuery } from './useApi';
import { useState } from 'react';
import { DateData } from 'react-native-calendars';

export const useGetDiaries = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const { data: diaries = [], isLoading } = useApiQuery<Diary.GetDiariesResponse>(
    {
      key: ['diaries', currentDate],
      path: `/diaries?date=${currentDate}`,
    },
    { requireAuth: true },
  );

  const handleMonthChange = (month: DateData) => {
    const dateQuery = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setCurrentDate(dateQuery);
  };

  return { diaries, isLoading, handleMonthChange };
};

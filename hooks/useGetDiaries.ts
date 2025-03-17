import { Diary } from '@/core/api';
import { useApiQuery } from './useApi';
import { useState } from 'react';
import { DateData } from 'react-native-calendars';

export const useGetDiaries = () => {
  const [currentMonth, setCurrentMonth] = useState<string>('2025-03');

  const { data: diaries = [], isLoading } = useApiQuery<Diary.GetDiariesResponse>(
    {
      key: ['diaries', currentMonth], // 쿼리 키가 변경되면 자동으로 쿼리를 다시 실행
      path: `/diaries?date=${currentMonth}`,
    },
    { requireAuth: true },
  );

  const handleMonthChange = (dateData: DateData) => {
    const { year, month } = dateData;
    setCurrentMonth(`${year}-${month}`);
  };

  return { diaries, isLoading, handleMonthChange };
};

import { Diary } from '@/core/api';
import { formatMonth, getTodayDateData, padToTwoDigits } from '@/utils/dates';
import { useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { useApiQuery } from './useApi';

export const useGetDiaries = () => {
  const todayDateData = getTodayDateData();
  const [selectedMonth, setSelectedMonth] = useState<string>(formatMonth(todayDateData));

  const {
    data: getDiariesResponse,
    isLoading,
    refetch,
  } = useApiQuery<Diary.GetDiariesResponse>(
    {
      key: ['diaries', selectedMonth], // 쿼리 키가 변경되면 자동으로 쿼리를 다시 실행
      path: `/diaries?date=${selectedMonth}`,
    },
    { requireAuth: true },
  );

  const { writtenDates, diaryInfos } = useMemo(() => {
    if (!getDiariesResponse) {
      return { writtenDates: [], diaryInfos: [] };
    }

    const { days, diaryInfos } = getDiariesResponse.data;
    const writtenDates = days.map((day) => `${selectedMonth}-${padToTwoDigits(day)}`);

    return { writtenDates, diaryInfos };
  }, [getDiariesResponse, selectedMonth]);

  const handleMonthChange = (dateData: DateData) => {
    const month = formatMonth(dateData);
    setSelectedMonth(month);
  };

  return { selectedMonth, writtenDates, diaryInfos, isLoading, handleMonthChange, refetch };
};

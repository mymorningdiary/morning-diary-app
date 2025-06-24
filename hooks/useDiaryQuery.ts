import { diaryAPI } from '@/core/api';
import { formatMonth, padToTwoDigits } from '@/utils/dates';
import { getTodayDateData } from '@/utils/dates';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';

export const DIARY_QUERY_KEY = 'DIARY';

export const useGetDiaries = () => {
  const todayDateData = getTodayDateData();
  const [selectedMonth, setSelectedMonth] = useState<string>(formatMonth(todayDateData));

  const {
    data: getDiariesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [DIARY_QUERY_KEY, selectedMonth],
    queryFn: () => diaryAPI.getDiaries({ date: selectedMonth }),
  });

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

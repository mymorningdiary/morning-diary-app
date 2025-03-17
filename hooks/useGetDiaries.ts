import { Diary } from '@/core/api';
import { formatYearMonth, getTodayDateData, padToTwoDigits } from '@/utils/dates';
import { useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { useApiQuery } from './useApi';

export const useGetDiaries = () => {
  const todayDateData = getTodayDateData();
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    formatYearMonth(todayDateData),
  );

  const { data: getDiariesResponse, isLoading } = useApiQuery<Diary.GetDiariesResponse>(
    {
      key: ['diaries', selectedYearMonth], // 쿼리 키가 변경되면 자동으로 쿼리를 다시 실행
      path: `/diaries?date=${selectedYearMonth}`,
    },
    { requireAuth: true },
  );

  const { writtenDates, diaryInfos } = useMemo(() => {
    if (!getDiariesResponse) {
      return { writtenDates: [], diaryInfos: [] };
    }

    const { days, diaryInfos } = getDiariesResponse.data;
    const writtenDates = days.map((day) => `${selectedYearMonth}-${padToTwoDigits(day)}`);

    return { writtenDates, diaryInfos };
  }, [getDiariesResponse, selectedYearMonth]);

  const handleMonthChange = (dateData: DateData) => {
    const yearMonth = formatYearMonth(dateData);
    setSelectedYearMonth(yearMonth);
  };

  return { writtenDates, diaryInfos, isLoading, handleMonthChange };
};

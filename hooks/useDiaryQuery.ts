import { useAuth } from '@/contexts/AuthContext';
import { diaryAPI } from '@/core/api';
import { Diary } from '@/core/types';
import { formatMonth, getTodayDateData, padToTwoDigits } from '@/utils/dates';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DateData } from 'react-native-calendars';

export const DIARY_QUERY_KEY = 'DIARY';

export const useGetDiaries = () => {
  const { logout } = useAuth();

  const todayDateData = getTodayDateData();
  const [selectedMonth, setSelectedMonth] = useState<string>(formatMonth(todayDateData));
  const [writtenDates, setWrittenDiaries] = useState<string[]>([]);
  const [diaryInfos, setDiaryInfos] = useState<Diary[]>([]);

  const {
    data: getDiariesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [DIARY_QUERY_KEY, selectedMonth],
    queryFn: () => diaryAPI.getDiaries({ date: selectedMonth }),
  });

  useEffect(() => {
    if (getDiariesResponse === undefined) return;

    switch (getDiariesResponse.code) {
      case 2000: {
        const dates = getDiariesResponse.data.days.map(
          (day) => `${selectedMonth}-${padToTwoDigits(day)}`,
        );

        setWrittenDiaries(dates);
        setDiaryInfos(getDiariesResponse.data.diaryInfos);
        break;
      }
      case 4001:
      case 4002:
      case 4003: {
        logout();
        break;
      }
    }
  }, [getDiariesResponse]);

  const handleMonthChange = (dateData: DateData) => {
    const month = formatMonth(dateData);
    setSelectedMonth(month);
  };

  return { selectedMonth, writtenDates, diaryInfos, isLoading, handleMonthChange, refetch };
};

export const useGetDiary = ({ diaryId }: { diaryId: number }) => {
  const { logout } = useAuth();

  const [diary, setDiary] = useState<Diary | null>(null);

  const {
    data: getDiaryResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [DIARY_QUERY_KEY, diaryId],
    queryFn: () => diaryAPI.getDiary({ diaryId }),
  });

  useEffect(() => {
    if (!getDiaryResponse) return;

    switch (getDiaryResponse.code) {
      case 2000: {
        setDiary(getDiaryResponse.data);
        break;
      }
      case 4001:
      case 4002:
      case 4003: {
        logout();
        break;
      }
    }
  }, [getDiaryResponse]);

  return { diary };
};

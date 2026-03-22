import { useQuery } from '@tanstack/react-query';
import { getDiaryById } from '../api/get-diaries';

export function useReadDiary(diaryId?: number) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['diary', diaryId],
    queryFn: () => getDiaryById(diaryId as number),
    enabled: diaryId != null,
  });

  return {
    diary: data?.data ?? null,
    error,
    isError,
    isLoading,
  };
}

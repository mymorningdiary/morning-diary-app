import { useQuery } from '@tanstack/react-query';
import { getDiary } from '../api/get-diary';

export function useGetDiary(diaryId?: number) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['diary', diaryId],
    queryFn: () => getDiary(diaryId as number),
    enabled: diaryId != null,
  });

  return {
    diary: data?.data ?? null,
    error,
    isError,
    isLoading,
  };
}

import { useQuery } from '@tanstack/react-query';
import { getDiary } from '../api/get-diary';
import { diaryQueryKeys } from './queryKeys';

export function useGetDiary(diaryId?: number) {
  const enabled = diaryId != null;

  const { data, error, isError, isLoading } = useQuery({
    queryKey: diaryQueryKeys.detail(diaryId),
    queryFn: () => {
      if (!enabled) {
        throw new Error('diaryId is required to fetch diary');
      }

      return getDiary(diaryId);
    },
    enabled,
  });

  return {
    diary: data?.data ?? null,
    error,
    isError,
    isLoading,
  };
}

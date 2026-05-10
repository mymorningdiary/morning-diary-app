import { useQuery } from '@tanstack/react-query';
import { getDiaries } from '../api/get-diaries';
import { diaryQueryKeys } from './queryKeys';

export function useGetDiaries(date?: string) {
  const enabled = date != null && date.trim().length > 0;

  return useQuery({
    queryKey: diaryQueryKeys.list(date),
    queryFn: () => {
      if (date == null || date.trim().length === 0) {
        throw new Error('date is required to fetch diaries');
      }

      return getDiaries(date);
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

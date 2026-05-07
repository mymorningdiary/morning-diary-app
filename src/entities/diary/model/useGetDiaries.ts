import { useQuery } from '@tanstack/react-query';
import { getDiaries } from '../api/get-diaries';

export function useGetDiaries(date?: string) {
  const enabled = date != null && date.trim().length > 0;

  return useQuery({
    queryKey: ['diary', date ?? null],
    queryFn: () => {
      if (date == null || date.trim().length === 0) {
        throw new Error('date is required to fetch diaries');
      }

      return getDiaries(date);
    },
    enabled,
  });
}

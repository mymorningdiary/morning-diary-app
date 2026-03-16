import { useQuery } from '@tanstack/react-query';
import { getTextGoals } from '../api/get-text-goals';

export function useTextGoals() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['text-goals'],
    queryFn: getTextGoals,
  });

  return { textGoals: data?.data.textGoals ?? null, error, isError, isLoading };
}

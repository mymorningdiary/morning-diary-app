import { useQuery } from '@tanstack/react-query';
import { getTextGoals } from '../api/get-text-goals';
import { textGoalQueryKeys } from './queryKeys';

export function useTextGoals() {
  const { data, error, isError, isLoading, isPending, isFetching } = useQuery({
    queryKey: textGoalQueryKeys.list(),
    queryFn: getTextGoals,
    staleTime: 1000 * 60 * 60,
  });

  const defaultTextGoal = data?.data.textGoals.find((textGoal) => textGoal.isDefault);

  return {
    textGoals: data?.data.textGoals ?? null,
    defaultTextGoal: defaultTextGoal ?? null,
    error,
    isError,
    isLoading,
    isPending,
    isFetching,
  };
}

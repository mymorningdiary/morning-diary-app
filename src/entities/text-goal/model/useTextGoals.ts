import { useQuery } from '@tanstack/react-query';
import { getTextGoals } from '../api/get-text-goals';

export function useTextGoals() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['text-goals'],
    queryFn: getTextGoals,
  });

  const defaultTextGoal = data?.data.textGoals.find((textGoal) => textGoal.isDefault);

  return {
    textGoals: data?.data.textGoals ?? null,
    defaultTextGoal: defaultTextGoal ?? null,
    error,
    isError,
    isLoading,
  };
}

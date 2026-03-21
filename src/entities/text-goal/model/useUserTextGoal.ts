import { selectTextGoal } from './select-text-goal';
import { useTextGoals } from './useTextGoals';

export function useUserTextGoal(textGoalId?: number) {
  const { textGoals, error, isError, isLoading } = useTextGoals();

  const userTextGoal = selectTextGoal(textGoals ?? [], textGoalId);

  return { userTextGoal, error, isError, isLoading };
}

import { selectCurrentTextGoal } from './selectCurrentTextGoal';
import { useTextGoals } from './useTextGoals';

export function useCurrentTextGoal(textGoalId?: number) {
  const { textGoals, error, isError, isLoading } = useTextGoals();

  const currentTextGoal = selectCurrentTextGoal(textGoals ?? [], textGoalId);

  return { currentTextGoal, error, isError, isLoading };
}

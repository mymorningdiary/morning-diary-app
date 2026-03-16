import { TextGoal } from './types';

export function selectCurrentTextGoal(textGoals: TextGoal[], textGoalId?: number) {
  if (textGoalId == null) return null;
  return textGoals.find((it) => it.textGoalId === textGoalId) ?? null;
}

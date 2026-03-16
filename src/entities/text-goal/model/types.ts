export interface TextGoal {
  textGoalId: number;
  title: string;
  textLength: number;
  option: string;
  isDefault: boolean;
  isUserTextGoal: boolean;
}

export interface TextGoalData {
  count: number;
  textGoals: TextGoal[];
}

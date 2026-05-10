export const textGoalQueryKeys = {
  all: ['text-goals'] as const,
  list: () => [...textGoalQueryKeys.all, 'list'] as const,
};

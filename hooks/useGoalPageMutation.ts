import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from './useUserQuery';
import { userAPI } from '@/core/api';

export const useGoalPageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: userAPI.updateGoalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });

  return { mutate };
};

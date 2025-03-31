import { userApi } from '@/core/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from './useGetUser';

export const useGoalPageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: userApi.updateGoalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });

  return { mutate };
};

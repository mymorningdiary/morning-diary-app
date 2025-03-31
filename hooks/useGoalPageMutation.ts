import { userApi } from '@/core/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const USER_QUERY_KEY = 'USER';

const useGoalPageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: userApi.updateGoalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });

  return { mutate };
};

export default useGoalPageMutation;

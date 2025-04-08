import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from './useUserQuery';
import { userAPI } from '@/core/api';
import { useState } from 'react';

export const useUpdateGoalPage = () => {
  const queryClient = useQueryClient();
  const [isUpdateGoalPageSuccess, setIsUpdateGoalPageSuccess] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateGoalPage,
    onSuccess: () => {
      console.log('[User Mutation] updateGoalPage success');
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      setIsUpdateGoalPageSuccess(true);
    },
  });

  return { mutate, isPending, isUpdateGoalPageSuccess };
};

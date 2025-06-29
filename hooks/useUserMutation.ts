import { userAPI } from '@/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { USER_QUERY_KEY } from './useUserQuery';

export const useUpdateGoalPage = () => {
  const [isUpdateGoalPageSuccess, setIsUpdateGoalPageSuccess] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateGoalPage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      setIsUpdateGoalPageSuccess(true);
    },
  });

  return { mutate, isPending, isUpdateGoalPageSuccess };
};

export const useUpdateTextGoal = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateTextGoal,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });

  return { mutate, isPending };
};

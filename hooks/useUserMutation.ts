import { USER_QUERY_KEY } from '@/contexts/UserContext';
import { userAPI } from '@/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export const useUpdatePushToken = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updatePushToken,
  });

  return { mutate, isPending };
};

export const useUpdateAlarmTime = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateAlarmTime,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });

  return { mutate, isPending };
};

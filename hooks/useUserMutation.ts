import { userAPI } from '@/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTextGoal = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateTextGoal,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { mutate, isPending };
};

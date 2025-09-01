import { ApiError, userAPI } from '@/core/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from './useUserQuery';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export const useUpdateTextGoal = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateTextGoal,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      switch (error.response?.data.code) {
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
  });

  return { mutate, isPending };
};

export const useUpdatePushToken = () => {
  const { logout } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updatePushToken,
    onSuccess: (res) => {},
    onError: (error: AxiosError<ApiError>) => {
      switch (error.response?.data.code) {
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
  });

  return { mutate, isPending };
};

export const useUpdateAlarmTime = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: userAPI.updateAlarmTime,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      switch (error.response?.data.code) {
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
  });

  return { mutate, isPending };
};

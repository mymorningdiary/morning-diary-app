import { ApiClient } from '@/core/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useApiQuery = <T>(
  info: {
    key: string[];
    path: string;
  },
  options?: {
    requiresAuth?: boolean;
    queryOptions?: any;
  },
) => {
  const { key, path } = info;
  const { requiresAuth, queryOptions } = options ?? {};

  return useQuery<T>({
    queryKey: key,
    queryFn: () => ApiClient.get<T>(path, { requiresAuth: requiresAuth }),
    ...queryOptions,
  });
};

export const useApiMutation = <T, V = void>(
  info: {
    path: string;
  },
  options?: {
    requiresAuth?: boolean;
    mutationOptions?: any;
  },
) => {
  const { path } = info;
  const { requiresAuth, mutationOptions } = options ?? {};

  return useMutation<T, Error, V>({
    mutationFn: (requestBody: V) =>
      ApiClient.post<T>(path, requestBody, {
        requiresAuth: requiresAuth,
      }),
    ...mutationOptions,
  });
};

import { ApiClient, MDError } from '@/core/api';
import { MutationOptions, useMutation, useQuery } from '@tanstack/react-query';

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

export const useApiMutation = <V, T>(
  resource: {
    path: string;
  },
  options?: {
    requiresAuth?: boolean;
    mutationOptions?: MutationOptions<T, MDError, V>;
  },
) => {
  const { path } = resource;

  return useMutation<T, MDError, V>({
    mutationFn: (requestBody: V) => ApiClient.post<T>(path, requestBody, options?.requiresAuth),
    ...options?.mutationOptions,
  });
};

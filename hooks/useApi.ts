import { ApiClient, MDError } from '@/core/api';
import { MutationOptions, useMutation, useQuery } from '@tanstack/react-query';

export const useApiQuery = <T>(
  info: {
    key: string[];
    path: string;
  },
  options?: {
    requireAuth?: boolean;
    queryOptions?: any;
  },
) => {
  const { key, path } = info;
  const { requireAuth, queryOptions } = options ?? {};

  return useQuery<T>({
    queryKey: key,
    queryFn: () => ApiClient.get<T>(path, { requireAuth }),
    ...queryOptions,
  });
};

export const useApiMutation = <V, T>(
  resource: {
    path: string;
  },
  options?: {
    requireAuth?: boolean;
    mutationOptions?: MutationOptions<T, MDError, V>;
  },
) => {
  const { path } = resource;
  const { requireAuth, mutationOptions } = options ?? {};

  return useMutation<T, MDError, V>({
    mutationFn: (requestBody: V) => ApiClient.post<T>(path, requestBody, { requireAuth }),
    ...mutationOptions,
  });
};

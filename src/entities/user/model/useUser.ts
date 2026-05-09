import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../api/get-users-info';
import { userQueryKeys } from './queryKeys';

export function useUser() {
  const { data, error, isError, isLoading, isPending, isFetching } = useQuery({
    queryKey: userQueryKeys.all,
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 5,
  });

  return { user: data?.data ?? null, error, isError, isPending, isFetching, isLoading };
}

import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../api/get-users-info';

export function useUser() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });

  return { user: data?.data ?? null, error, isLoading, isError };
}

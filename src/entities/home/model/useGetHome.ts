import { useQuery } from '@tanstack/react-query';
import { getHome } from '../api/get-home';
import { homeQueryKeys } from './queryKeys';

interface Options {
  date: string;
}

export function useGetHome({ date }: Options) {
  const { data, error, isError, isLoading, isFetching, isPending, refetch } = useQuery({
    queryKey: homeQueryKeys.detail(date),
    queryFn: () => getHome(date),
  });

  return {
    home: data?.data ?? null,
    error,
    isError,
    isLoading,
    isFetching,
    isPending,
    refetch,
  };
}

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getHome } from '../api/get-home';
import { homeQueryKeys } from './queryKeys';

type HomeQueryData = Awaited<ReturnType<typeof getHome>>;

interface Options {
  date: string;
  placeholderData?: UseQueryOptions<HomeQueryData>['placeholderData'];
}

export function useGetHome({ date, placeholderData }: Options) {
  const { data, error, isError, isLoading, isFetching, isPending, refetch } = useQuery({
    queryKey: homeQueryKeys.detail(date),
    queryFn: () => getHome(date),
    placeholderData,
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

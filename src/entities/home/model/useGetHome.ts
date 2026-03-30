import { useQuery } from '@tanstack/react-query';
import { getHome } from '../api/get-home';

interface Options {
  date: string;
}

export function useGetHome({ date }: Options) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['home', date],
    queryFn: () => getHome(date),
  });

  return {
    home: data?.data ?? null,
    error,
    isError,
    isLoading,
  };
}

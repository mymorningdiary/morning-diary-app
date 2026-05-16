import { useQuery } from '@tanstack/react-query';
import { getWeeklyReports } from '../api/get-weekly-reports';
import { reportQueryKeys } from './queryKeys';

export function useGetWeeklyReports(weeklyReportId?: number | null) {
  const enabled = weeklyReportId != null;

  const { data, error, isError, isLoading, isFetching, isPending, refetch } = useQuery({
    queryKey: reportQueryKeys.detail(weeklyReportId),
    queryFn: () => {
      if (weeklyReportId == null) {
        throw new Error('weeklyReportId is required to fetch weekly report');
      }

      return getWeeklyReports(weeklyReportId);
    },
    enabled,
  });

  return {
    weeklyReport: data?.data ?? null,
    error,
    isError,
    isLoading,
    isFetching,
    isPending,
    refetch,
  };
}

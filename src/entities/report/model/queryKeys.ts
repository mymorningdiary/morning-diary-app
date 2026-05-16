export const reportQueryKeys = {
  all: ['report'] as const,
  details: () => [...reportQueryKeys.all, 'detail'] as const,
  detail: (weeklyReportId?: number | null) =>
    [...reportQueryKeys.details(), ...(weeklyReportId ? [weeklyReportId] : [])] as const,
};

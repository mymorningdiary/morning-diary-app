import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { WeeklyReport } from '../model/types';

export const getWeeklyReports = async (
  weeklyReportId: number,
): Promise<ApiResponse<WeeklyReport>> => {
  const response = await authInstance.get(`/weekly-reports/${weeklyReportId}`);
  return response.data;
};

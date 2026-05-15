import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface PostWeeklyReportsResponse {
  weeklyReportId: number;
}

export const postWeeklyReports = async (): Promise<ApiResponse<PostWeeklyReportsResponse>> => {
  const response = await authInstance.post('/weekly-reports');
  return response.data;
};

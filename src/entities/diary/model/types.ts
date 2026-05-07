import { WeeklyReport } from '../../report';

export interface Diary {
  diaryId: number;
  writtenDate: string;
  dayOfWeek?: string;
  previewContent?: string;
  content?: string;
  title?: string | null;
  emotionScore?: number | null;
}
export interface Diaries {
  weekStartDate: string;
  weekEndDate: string;
  weeklyReport: WeeklyReport | null;
  diaries: Diary[];
}

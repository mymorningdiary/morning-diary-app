export interface Diary {
  diaryId: number;
  writtenDate: string;
  dayOfWeek?: string;
  previewContent?: string;
  content?: string;
  title?: string | null;
  emotionScore?: number | null;
}

export interface WeeklyReport {
  weeklyReportId: number;
  title: string;
}

export interface WeeklyDiaries {
  weekStartDate: string;
  weekEndDate: string;
  weeklyReport: WeeklyReport | null;
  diaries: Diary[];
}

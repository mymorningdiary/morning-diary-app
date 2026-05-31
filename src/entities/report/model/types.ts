export interface WeeklyReportTopKeyword {
  word: string;
  count: number;
}

export interface WeeklyReportInsight {
  title: string;
  content: string;
}

export interface WeeklyReportWrittenDate {
  diaryId: number;
  writtenDate: string;
  emotionScore: number;
  isDeleted?: boolean | null;
}

export interface WeeklyReport {
  weeklyReportId: number;
  weekStartDate: string;
  weekEndDate: string;
  title: string;
  summary: string;
  topKeywords: WeeklyReportTopKeyword[];
  unconsciousInsights: WeeklyReportInsight[];
  empathySentences: string[];
  writtenDates: WeeklyReportWrittenDate[];
}

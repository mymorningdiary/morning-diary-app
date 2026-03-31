export interface Diary {
  diaryId: number;
  writtenDate: string;
  dayOfWeek: string;
  previewContent: string;
  content: string;
  title: string | null;
  emotionScore: number | null;
}

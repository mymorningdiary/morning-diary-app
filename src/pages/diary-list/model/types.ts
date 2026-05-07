import { Diary } from '@entities/diary';
import { WeeklyReport } from '@entities/report';

export type DiaryWeeklySectionItem = Diary | WeeklyReport;

export interface DiaryWeeklySection {
  title: string;
  data: DiaryWeeklySectionItem[];
}

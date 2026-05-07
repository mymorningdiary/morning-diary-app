import { Diary, useGetDiaries } from '@entities/diary';

export interface DiaryListSection {
  index: number;
  title: string;
  week: number;
  data: Diary[];
}

export function useDiaryList(date: string) {
  const { data, isError, isLoading } = useGetDiaries(date);
}

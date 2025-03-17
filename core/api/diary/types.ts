import { BaseApiResponse } from '../types';

export type GetDiariesResponse = BaseApiResponse & {
  data: {
    days: number[];
    diaryInfos: DiaryInfo[];
  };
};

export type DiaryInfo = {
  diaryId: number;
  writtenDate: string;
  dayOfWeek: string;
  previewContent: string;
};

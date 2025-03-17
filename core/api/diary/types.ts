import { BaseApiResponse } from '../types';

export type GetDiariesResponse = BaseApiResponse & {
  data: {
    days: number[];
    diaryInfos: {
      diaryId: number;
      writtenDate: string;
      dayOfWeek: string;
      previewContent: string;
    }[];
  };
};

export interface GetDiariesRequest {
  date: string;
}

export interface PostDiariesRequest {
  writtenDate: string;
  content: string;
}

export interface PostDiariesResponse {
  diaryId: number;
  isFirstWrittenDiary: boolean;
  textLength: number;
}

export interface GetDiaryRequest {
  diaryId: number;
}

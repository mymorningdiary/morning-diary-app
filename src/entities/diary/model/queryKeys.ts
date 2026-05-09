export const diaryQueryKeys = {
  all: ['diary'] as const,
  lists: () => [...diaryQueryKeys.all, 'list'] as const,
  list: (date?: string | null) => [...diaryQueryKeys.lists(), date] as const,
  details: () => [...diaryQueryKeys.all, 'detail'] as const,
  detail: (diaryId?: number) =>
    [...diaryQueryKeys.details(), ...(diaryId ? [diaryId] : [])] as const,
};

export const homeQueryKeys = {
  all: ['home'] as const,
  detail: (date?: string) => [...homeQueryKeys.all, 'date', ...(date ? [date] : [])] as const,
};

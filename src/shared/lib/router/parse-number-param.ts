export const parseNumberParam = (value: string | string[] | undefined): number | undefined => {
  const singleValue = Array.isArray(value) ? value[0] : value;
  if (singleValue === undefined) return undefined;

  const parsed = Number(singleValue);
  return Number.isNaN(parsed) ? undefined : parsed;
};

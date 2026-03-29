interface MarkedDates {
  [key: string]: {
    selected?: boolean;
    marked?: boolean;
    emotion?: number;
  };
}

export type { MarkedDates };

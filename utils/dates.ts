import { DateData } from 'react-native-calendars';

export const formatCalendarDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatCalendarHeaderDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear().toString().slice(2); // 년도의 마지막 2자리
  const month = d.getMonth() + 1; // 월 (0-11이므로 1을 더함)

  return `${year}년${month}월`;
};

export const getTodayDateData = (): DateData => {
  const today = new Date();
  return {
    dateString: formatCalendarDate(today),
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    timestamp: today.getTime(),
  };
};

export const padToTwoDigits = (num: number) => {
  return String(num).padStart(2, '0');
};

export const formatYearMonth = (dateData: DateData) => {
  const { year, month } = dateData;
  return `${year}-${padToTwoDigits(month)}`;
};

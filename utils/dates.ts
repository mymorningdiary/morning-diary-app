import { DateData } from 'react-native-calendars';

export const formatCalendarDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

export const formatMonth = (dateData: DateData) => {
  const { year, month } = dateData;
  return `${year}-${padToTwoDigits(month)}`;
};

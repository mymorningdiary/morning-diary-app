import dayjs from 'dayjs';

export function shouldWeeklyReportRefresh() {
  const now = dayjs();

  return now.day() === 0 && now.hour() >= 20; // 일요일 20시
}

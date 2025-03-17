export const API_CONFIG = {
  baseUrl: 'https://api-dev.mymorningdiary.com', // TODO: 환경변수로 관리
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

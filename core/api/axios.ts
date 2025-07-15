import axios from 'axios';
import { authManager } from '../storage';

const BASE_URL = 'https://api-dev.mymorningdiary.com'; // TODO: 실제 API URL로 변경 필요

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const accessToken = await authManager.getAccessToken();
    // console.log('access token:', accessToken); // 토큰 존재 여부 확인

    if (accessToken) {
      console.log('access token:', accessToken); // 토큰 존재 여부 확인
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (error) {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환했지만 2xx 범위가 아닌 경우
      console.error('[Axios] Server error:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('[Axios] Network error');
    } else {
      // 요청 설정 중 에러 발생
      console.error('[Axios] Request error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

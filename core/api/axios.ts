import axios from 'axios';

const BASE_URL = 'https://api.morning-diary.com'; // TODO: 실제 API URL로 변경 필요

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // TODO: 토큰이 필요한 경우 여기서 추가
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: 에러 처리 로직 추가
    // if (error.response?.status === 401) {
    //   // 토큰 만료 등의 처리
    // }
    return Promise.reject(error);
  },
);

export default axiosInstance;

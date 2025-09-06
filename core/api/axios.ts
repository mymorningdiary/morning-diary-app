import axios, { AxiosError } from 'axios';
import { authManager } from '../storage';
import { ApiError } from './types';

const BASE_URL = 'https://api-dev.mymorningdiary.com'; // TODO: 실제 API URL로 변경 필요

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await authManager.getAccessToken();
    if (accessToken) {
      console.log('accessToken: ', accessToken);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // 네트워크 에러 처리
    if (!error.response) {
      const networkError: ApiError = {
        message: '네트워크 연결을 확인해주세요',
        status: 0,
        code: 0,
      };
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;
    const authErrorCode = [4001, 4002, 4003];

    if (status === 401 || authErrorCode.includes(data?.code)) {
      authManager.removeAccessToken();
    }

    return Promise.reject(error.response.data);
  },
);

export default apiClient;

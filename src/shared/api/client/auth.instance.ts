import axios, { AxiosHeaders, AxiosRequestHeaders } from 'axios';
import { API_URL } from '../../config';

import { useAuthStore } from '@shared/lib/auth';
import { Logger } from '@shared/lib/log';
import { instance } from './instance';
import { ApiResponse, Auth } from '../types';

const INSTANCE_TIMEOUT = 10000;
const INSTANCE_HEADER = {
  'Content-Type': 'application/json',
};

export const authInstance = axios.create({
  baseURL: API_URL,
  timeout: INSTANCE_TIMEOUT,
  headers: INSTANCE_HEADER,
});

authInstance.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    // 요청 기본 정보 로그
    Logger('AXIOS(AUTH)').debug(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
      data: config.data,
    });

    if (accessToken) {
      config.headers = setAuthHeader(config.headers, accessToken);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 여러 API가 동시에 401이여도 refresh 요청은 1번만 수행, 나머지는 요청을 기다렸다가 재시도
let refreshPromise: Promise<string> | null = null;

authInstance.interceptors.response.use(
  (response) => {
    Logger('AXIOS(AUTH)').debug('response', {
      status: response.status,
      url: `${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
      data: response.data,
    });

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const currentAccessToken = useAuthStore.getState().accessToken;
    const sentAccessToken = AxiosHeaders.from(originalRequest.headers ?? {}).get('Authorization');

    // 응답 에러 로그
    Logger('AXIOS(AUTH)').debug('response error', {
      status: error.response?.status,
      url: `${originalRequest?.baseURL ?? ''}${originalRequest?.url ?? ''}`,
      retry: originalRequest?._retry,
    });

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // 동일 요청의 중복 재시도 방지
      originalRequest._retry = true;

      // RETRY: 이전 refresh 완료 직후 도착한 401은 최신 토큰으로 재시도
      if (currentAccessToken && sentAccessToken !== `Bearer ${currentAccessToken}`) {
        // 이미 최신 토큰이 있다면 refresh 없이 재시도
        Logger('AXIOS(AUTH)').debug('retry request without refreshing', {
          url: `${originalRequest.baseURL ?? ''}${originalRequest.url ?? ''}`,
        });

        originalRequest.headers = setAuthHeader(originalRequest.headers, currentAccessToken);
        return authInstance(originalRequest);
      }

      // REFRESH 시작 로그
      Logger('AXIOS(AUTH)').debug('refresh start', {
        url: `${originalRequest.baseURL ?? ''}${originalRequest.url ?? ''}`,
      });

      // REFRESH: 동시에 하나만 수행하도록 Promise 공유
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newAccessToken = await refreshPromise;
        // 새 토큰 저장
        useAuthStore.setState({ accessToken: newAccessToken });
        originalRequest.headers = setAuthHeader(originalRequest.headers, newAccessToken);

        // REFRESH 이후 원 요청 재시도
        Logger('AXIOS(AUTH)').debug('retry request', {
          url: `${originalRequest.baseURL ?? ''}${originalRequest.url ?? ''}`,
        });

        return authInstance(originalRequest);
      } catch (error) {
        // REFRESH 실패 시 인증 상태 초기화
        Logger('AXIOS(AUTH)').error('refresh failed', error);
        useAuthStore.setState({ accessToken: null });
        useAuthStore.setState({ refreshToken: null });
      }
    }

    return Promise.reject(error);
  },
);

// refresh 토큰으로 accessToken 재발급
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    // refresh 토큰이 없으면 인증 초기화
    useAuthStore.setState({ accessToken: null, refreshToken: null });
    throw new Error('No refresh token');
  }

  // refresh 토큰으로 accessToken 요청
  const res = await instance.post<ApiResponse<Auth>>('/auth/token', undefined, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  return res.data.data.accessToken;
};

// Authorization 헤더 설정 헬퍼
const setAuthHeader = (
  headers: AxiosRequestHeaders | AxiosHeaders | undefined,
  accessToken: string,
): AxiosHeaders => {
  const next = AxiosHeaders.from(headers ?? {});
  next.set('Authorization', `Bearer ${accessToken}`);
  return next;
};

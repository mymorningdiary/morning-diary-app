import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getGlobalSignInHandler, getGlobalSignOutHandler } from './authHandlers';
import { ApiError, ApiResponse } from './types';
import { Auth } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refresh token 전용 클라이언트 (interceptor 없음)
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

function addToQueue(callback: (token: string | null) => void) {
  refreshQueue.push(callback);
}

function resolveQueue(token: string | null) {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');

    // 요청 기본 정보 로그
    console.log(`[API][Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      hasAccessToken: !!accessToken,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('[API][Request Error]', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (!error.response) {
      const networkError: ApiError = {
        message: '네트워크 연결을 확인해주세요',
        status: 0,
        code: 0,
      };
      console.warn('[API][NetworkError]', error.config?.url, networkError);
      return Promise.reject(networkError);
    }

    const { data, config, status } = error.response;
    const requestUrl = (config as InternalAxiosRequestConfig)?.url;

    switch (data?.code) {
      case 4000: // not exist user
      case 4001: // not exist access token
      case 4002: // invalid access token
        console.warn(
          `[API][AccessToken Invalid] url=${requestUrl}, code=${data?.code}, status=${status}`,
        );
        getGlobalSignOutHandler()?.();
        break;
      case 4003: {
        // expired access token

        console.warn(
          `[API][AccessToken Expired] url=${requestUrl}, code=${data?.code}, status=${status}`,
        );

        const originalRequest = config as InternalAxiosRequestConfig;

        // 토큰 리프레시중 -> API 요청들 큐에 대기
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            addToQueue((newToken) => {
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(apiClient(originalRequest));
              } else {
                reject(error);
              }
            });
          });
        }

        isRefreshing = true;

        try {
          // 로컬에서 refreshToken 로드
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          // 리프레시 토큰 API 요청
          console.log('[Auth][RefreshToken Attempt]', { refreshToken });
          const { data: refreshTokenResponse } = await refreshClient.post<ApiResponse<Auth>>(
            '/auth/token',
            undefined,
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            },
          );

          const newAccessToken = refreshTokenResponse?.data?.accessToken;
          if (!newAccessToken) throw new Error('No new access token');

          // newAccessToken -> 로컬 저장 및 AppContext state 변경
          console.log('[Auth][AccessToken Refreshed]', newAccessToken);
          getGlobalSignInHandler()?.({ accessToken: newAccessToken });

          // 큐에 쌓인 API 요청들 실행
          resolveQueue(newAccessToken);

          // 현재 API 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (err) {
          console.error('[Auth][RefreshToken Failed]', err);
          resolveQueue(null); // 큐에 쌓인 API 요청들 모두 실패 (reject) 처리
          getGlobalSignOutHandler()?.();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      case 4004: // not exist refresh token
      case 4005: // invalid refresh token
      case 4006: // expired refresh token
        console.warn(
          `[API][RefreshToken Invalid/Expired] url=${requestUrl}, code=${data?.code}, status=${status}`,
        );
        getGlobalSignOutHandler()?.();
        break;
    }

    return Promise.reject(error.response.data);
  },
);

export default apiClient;

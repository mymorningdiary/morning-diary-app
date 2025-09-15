import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getGlobalSignInHandler, getGlobalSignOutHandler } from './authHandlers';
import { ApiError } from './types';
import authAPI from './auth/apis';

const BASE_URL = 'https://api-dev.mymorningdiary.com'; // TODO: 실제 API URL로 변경 필요

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.url?.includes('/auth/token')) {
      return config;
    }

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
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        if (refreshToken) {
          try {
            console.log('[Auth][RefreshToken Attempt]', { refreshToken });
            const { data: refreshData } = await authAPI.refreshToken(refreshToken);
            const accessToken = refreshData?.accessToken;

            if (accessToken) {
              console.log('[Auth][AccessToken Refreshed]', accessToken);
              getGlobalSignInHandler()?.({ accessToken });

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              return apiClient(originalRequest);
            }
          } catch (err) {
            console.error('[Auth][RefreshToken Failed]', err);
            getGlobalSignOutHandler()?.();
          }
        } else {
          console.warn('[Auth][No RefreshToken Found]');
          getGlobalSignOutHandler()?.();
        }
        break;
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

import axios from 'axios';
import { API_URL } from '../../config';
import { Logger } from '@shared/lib/log';

const INSTANCE_TIMEOUT = 10000;
const INSTANCE_HEADER = {
  'Content-Type': 'application/json',
};

export const instance = axios.create({
  baseURL: API_URL,
  timeout: INSTANCE_TIMEOUT,
  headers: INSTANCE_HEADER,
});

instance.interceptors.request.use(
  async (config) => {
    Logger('AXIOS').debug(
      `request [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
      {
        headers: config.headers,
        params: config.params,
      },
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    Logger('AXIOS').debug(
      `response [${response.config.method?.toUpperCase()}] ${response.config.baseURL ?? ''}${response.config.url ?? ''}`,
      {
        headers: response.config.headers,
        data: response.data,
      },
    );

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    Logger('AXIOS').debug('response error', {
      url: `${originalRequest?.baseURL ?? ''}${originalRequest?.url ?? ''}`,
      status: error.response?.status,
      data: error.response?.data,
      retry: originalRequest?._retry,
    });

    return Promise.reject(error.response?.data ?? error);
  },
);

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
    Logger('instance').debug(`${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    Logger('instance').debug('response error', {
      status: error.response?.status,
      url: `${originalRequest?.baseURL ?? ''}${originalRequest?.url ?? ''}`,
      retry: originalRequest?._retry,
    });

    return Promise.reject(error);
  },
);

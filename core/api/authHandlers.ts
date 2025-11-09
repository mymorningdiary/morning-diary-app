import { Logger } from '@/utils/logs';
import { Auth } from '../types';

let globalSetAuthTokenHandler: (({ accessToken, refreshToken }: Auth) => void) | null = null;

export const setGlobalSetAuthTokenHandler = (
  handler: ({ accessToken, refreshToken }: Auth) => void,
) => {
  globalSetAuthTokenHandler = handler;
};

export const getGlobalSetAuthTokenHandler = () => {
  if (!globalSetAuthTokenHandler) {
    Logger('getGlobalSetAuthTokenHandler').warn('Global setAuthToken handler not initialized');
    return () => {};
  }
  return globalSetAuthTokenHandler;
};

let globalClearAuthTokenHandler: (() => void) | null = null;

export const setGlobalClearAuthTokenHandler = (handler: () => void) => {
  globalClearAuthTokenHandler = handler;
};

export const getGlobalClearAuthTokenHandler = () => {
  if (!globalClearAuthTokenHandler) {
    Logger('getGlobalClearAuthTokenHandler').warn('Global clearAuthToken handler not initialized');
    return () => {};
  }
  return globalClearAuthTokenHandler;
};

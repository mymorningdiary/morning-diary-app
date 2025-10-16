import { Auth } from '../types';

let globalSetAuthTokenHandler: (({ accessToken, refreshToken }: Auth) => void) | null = null;

export const setGlobalSetAuthTokenHandler = (
  handler: ({ accessToken, refreshToken }: Auth) => void,
) => {
  globalSetAuthTokenHandler = handler;
};

export const getGlobalSetAuthTokenHandler = () => {
  if (!globalSetAuthTokenHandler) {
    console.warn('Global setAuthToken handler not initialized');
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
    console.warn('Global clearAuthToken handler not initialized');
    return () => {};
  }
  return globalClearAuthTokenHandler;
};

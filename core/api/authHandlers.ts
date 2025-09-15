import { Auth } from '../types';

let globalSignInHandler: (({ accessToken, refreshToken }: Auth) => void) | null = null;
let globalSignOutHandler: (() => void) | null = null;

export const setGlobalSignInHandler = (handler: ({ accessToken, refreshToken }: Auth) => void) => {
  globalSignInHandler = handler;
};

export const getGlobalSignInHandler = () => {
  if (!globalSignInHandler) {
    console.warn('Global sign in handler not initialized');
    return () => {};
  }
  return globalSignInHandler;
};

export const setGlobalSignOutHandler = (handler: () => void) => {
  globalSignOutHandler = handler;
};

export const getGlobalSignOutHandler = () => {
  if (!globalSignOutHandler) {
    console.warn('Global sign out handler not initialized');
    return () => {};
  }
  return globalSignOutHandler;
};

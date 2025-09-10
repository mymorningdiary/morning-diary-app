let globalSignOutHandler: (() => void) | null = null;

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

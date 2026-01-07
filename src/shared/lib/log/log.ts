export const Logger = (tag: string) => {
  return {
    debug: (...args: any[]): void => {
      if (!__DEV__) return;
      console.log(`[${tag}]`, ...args);
    },
    warn: (...args: any[]): void => {
      if (!__DEV__) return;
      console.warn(`[${tag}]`, ...args);
    },
    error: (...args: any[]): void => {
      if (!__DEV__) return;
      console.error(`[${tag}]`, ...args);
    },
  };
};

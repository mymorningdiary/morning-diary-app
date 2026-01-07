import { createContext, use } from 'react';

export interface SessionContextType {
  session: string | null;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionContextType | null>({
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

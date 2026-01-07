import { useAuth } from '@entities/auth';
import { PropsWithChildren } from 'react';
import { SessionContext } from '../model/context';

export function SessionProvider({ children }: PropsWithChildren) {
  const { accessToken, isLoading } = useAuth();

  return (
    <SessionContext.Provider
      value={{
        session: accessToken,
        isLoading,
      }}>
      {children}
    </SessionContext.Provider>
  );
}

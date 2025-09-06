import { userAPI } from '@/core/api';
import { User } from '@/core/types';
import { Nullable } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createContext, use, useEffect, useState } from 'react';

const UserContext = createContext<{ user: User | null }>({ user: null });

export function useUser() {
  const value = use(UserContext);
  if (!value) {
    throw new Error('useUser must be wrapped in a <UserProvider />');
  }

  return value;
}

export const USER_QUERY_KEY = 'USER';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Nullable<User>>(null);

  const { data } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => userAPI.getUser(),
  });

  useEffect(() => {
    console.log('[User State] getUserResponse: ', data);
    
    if (data?.code === 2000) {
      setUser(data.data);
    }
  }, [data]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};
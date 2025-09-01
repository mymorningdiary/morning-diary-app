import { User } from '@/core/types';
import { useGetUser } from '@/hooks';
import { Nullable } from '@/types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type UserContextType = {
  user: Nullable<User>;
  getUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  getUser: () => Promise.resolve(),
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Nullable<User>>(null);

  const { isLoggedIn } = useAuth();
  const { data: getUserResponse, refetch } = useGetUser();

  const getUser = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      await refetch();
    } catch (error) {
      console.error('[User Context] getUser error: ', error);
    }
  }, [isLoggedIn, refetch]);

  useEffect(() => {
    getUser();
  }, [isLoggedIn, getUser]);

  useEffect(() => {
    console.log('[User State] Login status changed: ', isLoggedIn);
    console.log('[User State] getUserResponse: ', getUserResponse);

    if (isLoggedIn && getUserResponse) {
      switch (getUserResponse.code) {
        case 2000: {
          setUser(getUserResponse.data);
          break;
        }
      }
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getUserResponse]);

  return <UserContext.Provider value={{ user, getUser }}>{children}</UserContext.Provider>;
};

export default UserContext;

export const useUser = () => {
  const { user, getUser } = useContext(UserContext);

  return { user, getUser };
};

import { User } from '@/core/types';
import { useGetUser } from '@/hooks';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
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

  const getUser = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('[User Context] getUser error: ', error);
    }
  };

  useEffect(() => {
    console.log('[User State] Login status changed: ', isLoggedIn);

    if (isLoggedIn === true) {
      refetch();
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log('[User State] getUserResponse: ', getUserResponse);
    if (getUserResponse === undefined) return;

    switch (getUserResponse.code) {
      case 2000: {
        setUser(getUserResponse.data);
        break;
      }
    }
  }, [getUserResponse]);

  return <UserContext.Provider value={{ user, getUser }}>{children}</UserContext.Provider>;
};

export default UserContext;

export const useUser = () => {
  const { user, getUser } = useContext(UserContext);

  return { user, getUser };
};

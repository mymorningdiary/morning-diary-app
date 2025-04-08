import { User } from '@/core/types';
import { useGetUser } from '@/hooks';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type UserContextType = {
  user: Nullable<User>;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: getUserResponse } = useGetUser();
  const { isLoggedIn } = useAuth();

  const [user, setUser] = useState<Nullable<User>>(null);

  useEffect(() => {
    console.log('[User State] Login status changed: ', isLoggedIn);

    if (isLoggedIn && getUserResponse) {
      setUser(getUserResponse.data);
    } else {
      setUser(null);
    }
  }, [isLoggedIn, getUserResponse]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserContext;

export const useUser = () => {
  const { user } = useContext(UserContext);

  return { user };
};

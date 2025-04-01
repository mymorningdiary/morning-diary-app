import { authManager } from '@/core/storage/auth';
import { User } from '@/core/types';
import { useGetUser } from '@/hooks';
import { Nullable } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type UserContextType = {
  user: Nullable<User>;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: getUserResponse } = useGetUser();

  const [user, setUser] = useState<Nullable<User>>(null);

  useEffect(() => {
    if (getUserResponse) {
      setUser(getUserResponse.data);
    }
  }, [getUserResponse]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserContext;

export const useUser = () => {
  const { user } = useContext(UserContext);

  return { user };
};

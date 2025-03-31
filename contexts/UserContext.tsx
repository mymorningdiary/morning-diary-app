import { authManager } from '@/core/storage/auth';
import { User } from '@/core/types';
import { useGetUser } from '@/hooks';
import { Nullable } from '@/types';
import { createContext, useEffect, useState } from 'react';

type UserContextType = {
  user: Nullable<User>;
  isLogin: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLogin: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: getUserResponse } = useGetUser();

  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<Nullable<User>>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const accessToken = await authManager.getAccessToken();
      if (accessToken) {
        setIsLogin(true);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (getUserResponse) {
      setUser(getUserResponse.data);
    }
  }, [getUserResponse]);

  return <UserContext.Provider value={{ user, isLogin }}>{children}</UserContext.Provider>;
};

export default UserContext;

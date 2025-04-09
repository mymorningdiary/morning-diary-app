import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/core/api';
import { useQuery } from '@tanstack/react-query';

export const USER_QUERY_KEY = 'USER';

export const useGetUser = () => {
  const { isLoggedIn } = useAuth();

  const { data, refetch } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => userAPI.getUser(),
    enabled: isLoggedIn === true,
  });

  return { data, refetch };
};

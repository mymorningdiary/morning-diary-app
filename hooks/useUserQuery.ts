import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/core/api';
import { ApiError, ApiResponse } from '@/core/api/types';
import { User } from '@/core/types';
import { useQuery } from '@tanstack/react-query';

export const USER_QUERY_KEY = 'USER';

export const useGetUser = () => {
  const { isLoggedIn } = useAuth();

  const { data, error, refetch } = useQuery<ApiResponse<User>, ApiError>({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => userAPI.getUser(),
    enabled: isLoggedIn === true,
  });

  return { data, error, refetch };
};

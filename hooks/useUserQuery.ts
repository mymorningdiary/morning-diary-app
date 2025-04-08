import { userAPI } from '@/core/api';
import { useQuery } from '@tanstack/react-query';

export const USER_QUERY_KEY = 'USER';

export const useGetUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => userAPI.getUser(),
  });

  return { data };
};

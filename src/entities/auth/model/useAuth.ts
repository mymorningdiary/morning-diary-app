import { Auth } from '@shared/api/types';
import { useStorageState } from '@shared/lib/store';

export function useAuth() {
  const [[isLoading, accessToken], setAccessToken] = useStorageState('accessToken');
  const [_, setRefreshToken] = useStorageState('refreshToken');

  const setAuth = ({ accessToken, refreshToken }: Auth) => {
    setAccessToken(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
  };

  const clearAuth = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  return { accessToken, isLoading, setAuth, clearAuth };
}

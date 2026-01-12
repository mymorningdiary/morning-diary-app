import { Auth } from '@shared/api/types';
import { useAuthStore } from '@shared/lib/auth';

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const isLoaded = useAuthStore((s) => s.isAuthLoaded);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);

  const setAuth = ({ accessToken, refreshToken }: Auth) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken ?? null);
  };

  const clearAuth = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  return { accessToken, refreshToken, isLoaded, setAuth, clearAuth };
}

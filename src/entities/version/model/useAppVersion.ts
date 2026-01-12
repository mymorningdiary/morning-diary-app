import { useQuery } from '@tanstack/react-query';
import { getAppVersion } from '../api/get-app-version';
import { compareAppVersion } from '../lib/compareAppVersion';

// FIXME 백그라운드 -> 포그라운드일 때 재검사
export function useAppVersion() {
  const { data } = useQuery({
    queryKey: ['app-version'],
    queryFn: getAppVersion,
  });

  const versionStatus = data?.code === 2000 ? compareAppVersion(data.data) : 'ok';

  return { versionStatus };
}

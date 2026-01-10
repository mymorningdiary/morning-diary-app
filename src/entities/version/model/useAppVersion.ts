import { useQuery } from '@tanstack/react-query';
import { getAppVersion } from '../api/get-app-version';
import { compareAppVersion } from '../lib/compareAppVersion';

export function useAppVersion() {
  const { data } = useQuery({
    queryKey: ['app-version'],
    queryFn: getAppVersion,
  });

  const versionStatus = data?.code === 2000 ? compareAppVersion(data.data) : 'ok';

  return { versionStatus };
}

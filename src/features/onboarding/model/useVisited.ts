import { Logger } from '@/utils/logs';
import { useCallback, useEffect, useState } from 'react';
import { getIsFirstVisit, setIsFirstVisit } from '../api/storage';

export function useVisited() {
  const [isFirstVisit, setIsFirstVisitState] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const firstVisit = await getIsFirstVisit();
        if (isMounted) {
          setIsFirstVisitState(firstVisit);
        }
      } catch (error) {
        Logger('useVisited').error('Failed to read visited state', error);
        if (isMounted) {
          setIsFirstVisitState(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const markVisited = useCallback(() => {
    (async () => {
      try {
        await setIsFirstVisit(false);
      } catch (error) {
        Logger('useVisited').error('Failed to store visited state', error);
      } finally {
        setIsFirstVisitState(false);
      }
    })();
  }, []);

  return {
    isFirstVisit,
    isLoading,
    markVisited,
  };
}

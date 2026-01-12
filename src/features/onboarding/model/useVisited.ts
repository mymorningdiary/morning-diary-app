import { Logger } from '@/utils/logs';
import { useCallback, useEffect, useState } from 'react';
import { loadIsFirstVisit, saveIsFirstVisit } from '../api/storage';

export function useVisited() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const firstVisit = await loadIsFirstVisit();
        if (isMounted) {
          setIsFirstVisit(firstVisit);
        }
      } catch (error) {
        Logger('useVisited').error('Failed to read visited state', error);
        if (isMounted) {
          setIsFirstVisit(true);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
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
        await saveIsFirstVisit(false);
      } catch (error) {
        Logger('useVisited').error('Failed to store visited state', error);
      } finally {
        setIsFirstVisit(false);
      }
    })();
  }, []);

  return {
    isFirstVisit,
    isLoaded,
    markVisited,
  };
}

import { useVisitStore } from './store';

export function useVisit() {
  const isFirstVisit = useVisitStore((s) => s.isFirstVisit);
  const isLoaded = useVisitStore((s) => s.isLoaded);
  const setIsFirstVisit = useVisitStore((s) => s.setIsFirstVisit);

  const markVisited = () => {
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    isLoaded,
    markVisited,
  };
}

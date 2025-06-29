import textGoalAPI from '@/core/api/text-goal/apis';
import { TextGoal } from '@/core/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const TEXT_GOALS_QUERY_KEY = 'TEXT_GOALS';

const useGetTextGoals = () => {
  const [textGoals, setTextGoals] = useState<TextGoal[] | null>(null);

  const {
    data: getTextGoalsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [TEXT_GOALS_QUERY_KEY],
    queryFn: () => textGoalAPI.getTextGoals(),
  });

  useEffect(() => {
    if (getTextGoalsResponse === undefined) return;
    if (getTextGoalsResponse.code === 2000) {
      setTextGoals(getTextGoalsResponse.data.textGoals);
    }
  }, [getTextGoalsResponse]);

  return { textGoals, isLoading, refetch };
};

export default useGetTextGoals;

import { useEffect } from 'react';
import { useStorageGetItem } from './useStorage';
import { USER_INFO_ALARM_TIME, USER_INFO_GOAL_PAGE } from '@/constants/storage';
const useUser = () => {
  const { data: storageGoalPage } = useStorageGetItem<number>(USER_INFO_GOAL_PAGE);
  const { data: storageAlarmTime } = useStorageGetItem<string>(USER_INFO_ALARM_TIME);

  return {
    goalPage: storageGoalPage?.[0] ?? 0,
    alarmTime: storageAlarmTime?.[0] ?? '',
  };
};

export default useUser;

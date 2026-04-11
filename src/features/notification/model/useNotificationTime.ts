import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useUser } from '@entities/user';
import { NotificationTime } from '@entities/notification';

export function useNotificationTime() {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState<NotificationTime>({ hour: 7, minute: 0 });

  const formattedTime = dayjs()
    .hour(currentTime.hour)
    .minute(currentTime.minute)
    .locale('en')
    .format('hh:mm A');

  useEffect(() => {
    if (!user || !user.alarmTime) return;

    const [hour, minute] = user.alarmTime.split(':').map(Number);
    setCurrentTime({ hour, minute });
  }, [user]);

  return {
    currentTime,
    formattedTime,
    setCurrentTime,
  };
}

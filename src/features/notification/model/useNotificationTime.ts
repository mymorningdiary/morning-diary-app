import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useUser } from '@entities/user';
import { NotificationTime } from '@entities/notification';

export function useNotificationTime() {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState<NotificationTime>({ hours: 7, minutes: 0 });

  const formattedTime = dayjs()
    .hour(currentTime.hours)
    .minute(currentTime.minutes)
    .locale('en')
    .format('hh:mm A');

  useEffect(() => {
    if (!user || !user.alarmTime) return;

    const [hours, minutes] = user.alarmTime.split(':').map(Number);
    setCurrentTime({ hours, minutes });
  }, [user]);

  return {
    currentTime,
    formattedTime,
    setCurrentTime,
  };
}

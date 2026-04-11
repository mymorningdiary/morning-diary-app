import dayjs from 'dayjs';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NotificationTime } from '@entities/notification';
import { useUpdateNotificationTime } from '@entities/user';
import { useNotification, useNotificationTime } from '@features/notification';
import { useForeground } from '@shared/lib/app-state';
import { useThemeColor } from '@shared/lib/theme';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechSun } from '@shared/ui/Text';

import { TimePickerModal } from '@shared/ui/Modal';
import { NotificationTimeButton } from './NotificationTimeButton';

export function NotificationPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { isExistUser } = useLocalSearchParams<{ isExistUser?: 'true' | 'false' }>();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const { currentTime, formattedTime, setCurrentTime } = useNotificationTime();
  const { updateNotificationTime, isPending } = useUpdateNotificationTime({
    onSuccess: () => {
      if (isExistUser == 'false') {
        router.replace('/(app)/(main)');
        return;
      }

      router.back();
    },
    onError: (message) => {
      if (!message) return;
      useToastStore.getState().show({ type: 'error', message });
    },
  });
  const { hasPermission, turnPushOn, checkPermission } = useNotification();

  const handleTimeConfirm = (time: NotificationTime) => {
    setShowTimePicker(false);
    setCurrentTime(time);
  };

  const handleCompletePress = () => {
    if (isPending) return;

    const { hour, minute } = currentTime;
    const alarmTime = dayjs().hour(hour).minute(minute).second(0).format('HH:mm:ss');
    updateNotificationTime({ alarmTime });
  };

  useForeground(checkPermission);

  useEffect(() => {
    turnPushOn();
  }, []);

  useEffect(() => {
    if (hasPermission === false) {
      if (isExistUser == 'false') {
        router.replace('/(app)/(main)');
        return;
      }

      router.back();
    }
  }, [hasPermission]);

  return (
    <MDPage style={styles.container}>
      <MDAppBar
        title="알림"
        onBack={isExistUser != 'false' ? () => router.back() : undefined}
        onClose={isExistUser == 'false' ? () => router.replace('/(app)/(main)') : undefined}
      />
      <View style={styles.sunContent}>
        <SpeechSun text="햇님이가 알림을 보내드릴게요!" />

        <View>
          <MDText type="titleSemiBold" align="center">
            알림 받을 시간을 정해주세요
          </MDText>
          <MDText type="labelRegular" color={colors.text.alternative} align="center">
            나와의 약속을 만들어봐요
          </MDText>
        </View>

        <NotificationTimeButton
          style={{ marginHorizontal: 16 }}
          time={formattedTime}
          onPress={() => setShowTimePicker(true)}
        />
      </View>

      <MDButton
        style={styles.button}
        label="완료"
        loading={isPending}
        onPress={handleCompletePress}
      />

      <TimePickerModal
        visible={showTimePicker}
        time={currentTime}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  sunContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    marginHorizontal: 16,
  },
});

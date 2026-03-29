import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { TimerPickerModal } from 'react-native-timer-picker';

import { useNotification, useNotificationTime } from '@features/notification';
import { NotificationTime } from '@entities/notification';
import { useUpdateNotificationTime } from '@entities/user';
import { useThemeColor } from '@shared/lib/theme';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechSun } from '@shared/ui/Text';
import { useForeground } from '@shared/lib/app-state';

import { NotificationTimeButton } from './NotificationTimeButton';

const TIME_PICKER_MINUTES_INTERVAL = 5;

export function NotificationPage() {
  const colors = useThemeColor();
  const styles = PageStyles;
  const { width } = useWindowDimensions();

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

    const { hours, minutes } = currentTime;
    const alarmTime = dayjs().hour(hours).minute(minutes).second(0).format('HH:mm:ss');
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

      <TimerPickerModal
        styles={{
          container: { width: width * 0.8 },
          confirmButton: {
            borderColor: colors.primary.normal,
            color: colors.primary.normal,
          },
        }}
        initialValue={currentTime}
        visible={showTimePicker}
        hideSeconds
        confirmButtonText="완료"
        cancelButtonText="취소"
        padHoursWithZero
        hourLabel="시"
        minuteLabel="분"
        closeOnOverlayPress
        minuteInterval={TIME_PICKER_MINUTES_INTERVAL}
        setIsVisible={setShowTimePicker}
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
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

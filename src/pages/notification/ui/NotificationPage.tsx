import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { useNotificationTime } from '@features/notification';
import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechSun } from '@shared/ui/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TimerPickerModal } from 'react-native-timer-picker';
import { NotificationTimeButton } from './NotificationTimeButton';

const TIME_PICKER_MINUTES_INTERVAL = 5;

export function NotificationPage() {
  const colors = useThemeColor();
  const styles = PageStyles;
  const { width } = useWindowDimensions();

  const { isExistUser } = useLocalSearchParams<{ isExistUser?: 'true' | 'false' }>();

  const { currentTime, formattedTime, setCurrentTime } = useNotificationTime();
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <MDPage style={styles.container}>
      <MDAppBar
        title="알림"
        onBack={isExistUser != 'false' ? () => router.back() : undefined}
        onClose={isExistUser == 'false' ? () => router.replace('/(app)') : undefined}
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

      <MDButton style={styles.button} label="완료" />

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
        onConfirm={setCurrentTime}
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

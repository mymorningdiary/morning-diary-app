import { MDButton, MDLargeSpeechBubble, MDPressable, MDRow, MDText } from '@/components';
import { useNotification } from '@/contexts/NotificationContext';
import { useUser } from '@/contexts/UserContext';
import { appManager } from '@/core/storage';
import NotificationAppBar from '@/domain/notification/NotificationAppBar';
import { useThemeColor, useUpdateAlarmTime, useUpdatePushToken } from '@/hooks';
import { MDColors } from '@/types';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimerPickerModal } from 'react-native-timer-picker';

const formatAlarmTime = (alarmTime: AlarmTime): string => {
  const { hours, minutes } = alarmTime;
  const date = dayjs().hour(hours).minute(minutes);

  return date.format('hh:mm A');
};

interface AlarmTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AlarmTimeScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { fromScreen } = useLocalSearchParams<{ fromScreen: string }>();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedAlarmTime, setSelectedAlarmTime] = useState<AlarmTime | null>({
    days: 0,
    hours: 7,
    minutes: 0,
    seconds: 0,
  });
  const { user } = useUser();

  const { mutate: updateAlarmTime } = useUpdateAlarmTime();
  const { mutate: updatePushToken } = useUpdatePushToken();

  const { pushToken } = useNotification();

  const onBackButtonPress = () => {
    router.back();
  };

  const onSkipButtonPress = () => {
    router.replace('/(app)');
  };

  const onOpenTimePicker = () => {
    setShowTimePicker(true);
  };

  const onTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const onTimePickerConfirm = ({ hours, minutes }: AlarmTime) => {
    setSelectedAlarmTime({
      days: 0,
      hours,
      minutes,
      seconds: 0,
    });
    setShowTimePicker(false);
  };

  const onCompleteButtonPress = () => {
    if (selectedAlarmTime === null) return;

    const { hours, minutes } = selectedAlarmTime;
    const newAlarmTime = dayjs().hour(hours).minute(minutes).second(0).format('HH:mm:ss');

    updateAlarmTime({ alarmTime: newAlarmTime });
    if (fromScreen === 'permission') {
      router.replace('/');
    } else {
      router.back();
    }
  };

  const updateNotification = async () => {
    try {
      await appManager.markAlarmOn();
      updatePushToken({ pushToken });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user === null || user.alarmTime === null) return;

    const [hours, minutes] = user.alarmTime.split(':').map(Number);
    setSelectedAlarmTime({
      days: 0,
      hours,
      minutes,
      seconds: 0,
    });
  }, [user]);

  useEffect(() => {
    updateNotification();
  }, []);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        {fromScreen === 'permission' ? (
          <MDRow style={styles.containerSkipAppBar}>
            <MDPressable style={styles.buttonSkip} onPress={onSkipButtonPress}>
              <MDText type="labelRegular" color={colors.text.alternative}>
                건너뛰기
              </MDText>
            </MDPressable>
          </MDRow>
        ) : (
          <NotificationAppBar title="알림 시간" onBackButtonPress={onBackButtonPress} />
        )}

        <View style={styles.containerContent}>
          <View style={styles.containerSun}>
            <MDLargeSpeechBubble text="일어나서 바로 써볼까요?" />
            <Image source={require('@/assets/images/img-sun-basic.png')} style={styles.imageSun} />
          </View>
          <View style={styles.containerTitle}>
            <MDText type="titleSemiBold">알림을 받을 시간을 정해주세요</MDText>
            <MDText type="labelRegular" color={colors.text.alternative}>
              나와의 약속을 만들어봐요
            </MDText>
          </View>
          <MDPressable style={styles.buttonTimePicker} onPress={onOpenTimePicker}>
            <MDText type="bodyRegular">알림 시간</MDText>
            {selectedAlarmTime && (
              <MDText type="bodyRegular">{formatAlarmTime(selectedAlarmTime)}</MDText>
            )}
          </MDPressable>
        </View>
        <View style={styles.containerFooter}>
          <MDButton title="완료" onPress={onCompleteButtonPress} />
        </View>

        <TimerPickerModal
          styles={{
            container: { width: Dimensions.get('window').width * 0.8 },
            confirmButton: { borderColor: colors.primary.normal, color: colors.primary.normal },
          }}
          modalProps={{ overlayOpacity: 0.2 }}
          initialValue={selectedAlarmTime ?? { hours: 7, minutes: 0 }}
          visible={showTimePicker}
          hideSeconds
          confirmButtonText="완료"
          cancelButtonText="취소"
          padHoursWithZero
          hourLabel="시"
          minuteLabel="분"
          closeOnOverlayPress
          minuteInterval={5}
          setIsVisible={setShowTimePicker}
          onConfirm={onTimePickerConfirm}
          onCancel={onTimePickerCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerSkipAppBar: {
      height: 48,
      justifyContent: 'flex-end',
    },
    buttonSkip: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerContent: {
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'center',
      gap: 24,
    },
    containerSun: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageSun: {
      width: 93,
      height: 93,
    },
    containerTitle: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    buttonTimePicker: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary.softer,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    containerFooter: {
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
  });

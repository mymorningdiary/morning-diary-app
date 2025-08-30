import { MDButton, MDLargeSpeechBubble, MDPressable, MDRow, MDText } from '@/components';
import { useUser } from '@/contexts/UserContext';
import NotificationAppBar from '@/domain/notification/NotificationAppBar';
import { useThemeColor, useUpdateAlarmTime } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import dayjs from 'dayjs';

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

export default function NotificationScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { prevRoute } = useLocalSearchParams<{ prevRoute: string }>();

  const [showPicker, setShowPicker] = useState(false);
  const [alarmTime, setAlarmTime] = useState<AlarmTime | null>(null);
  const { user } = useUser();

  const { mutate: updateAlarmTime } = useUpdateAlarmTime();

  const navigateBack = () => {
    router.back();
  };

  const onSkipButtonPress = () => {
    router.back();
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  const onConfirmButtonPress = ({ hours, minutes }: AlarmTime) => {
    setAlarmTime({
      days: 0,
      hours,
      minutes,
      seconds: 0,
    });
    setShowPicker(false);
  };

  const onCompleteButtonPress = () => {
    if (alarmTime === null) return;

    const { hours, minutes } = alarmTime;
    const formattedAlarmTime = dayjs().hour(hours).minute(minutes).format('HH:mm:ss');

    updateAlarmTime({ alarmTime: formattedAlarmTime });
    if (prevRoute === '/onboarding') {
      router.replace('/main');
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (user === null || user.alarmTime === null) {
      setAlarmTime({
        days: 0,
        hours: 7,
        minutes: 0,
        seconds: 0,
      });
    } else {
      const parsed = dayjs(user.alarmTime, 'HH:mm:ss');

      setAlarmTime({
        days: 0,
        hours: parsed.hour(),
        minutes: parsed.minute(),
        seconds: parsed.second(),
      });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {prevRoute === 'onboarding' ? (
        <MDRow style={styles.containerSkipAppBar}>
          <MDPressable style={styles.buttonSkip} onPress={onSkipButtonPress}>
            <MDText type="labelRegular" color={colors.text.alternative}>
              건너띄기
            </MDText>
          </MDPressable>
        </MDRow>
      ) : (
        <NotificationAppBar title="알림 시간" navigateBack={navigateBack} />
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
        <MDPressable style={styles.buttonTimePicker} onPress={openPicker}>
          <MDText type="bodyRegular">알림 시간</MDText>
          {alarmTime && <MDText type="bodyRegular">{formatAlarmTime(alarmTime)}</MDText>}
        </MDPressable>
      </View>
      <View style={styles.containerFooter}>
        <MDButton title="완료" onPress={onCompleteButtonPress} />
      </View>

      <TimerPickerModal
        styles={{
          container: {
            width: Dimensions.get('window').width * 0.8,
          },
          confirmButton: {
            borderColor: colors.primary.normal,
            color: colors.primary.normal,
          },
        }}
        modalProps={{
          overlayOpacity: 0.2,
        }}
        visible={showPicker}
        hideSeconds
        confirmButtonText="완료"
        cancelButtonText="취소"
        padHoursWithZero
        hourLabel="시"
        minuteLabel="분"
        closeOnOverlayPress
        setIsVisible={setShowPicker}
        onConfirm={onConfirmButtonPress}
        onCancel={closePicker}
      />
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
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
      paddingBottom: 60,
    },
  });

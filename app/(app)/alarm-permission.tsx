import { MDButton, MDLargeSpeechBubble, MDPressable, MDRow, MDText } from '@/components';
import { useNotification } from '@/contexts/NotificationContext';
import { appManager } from '@/core/storage';
import { useThemeColor, useUpdatePushToken } from '@/hooks';
import { MDColors } from '@/types';
import { Logger } from '@/utils/logs';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AlarmPermissionScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { pushToken } = useNotification();
  const { mutate: updatePushToken } = useUpdatePushToken();

  const onSkipButtonPress = () => {
    router.replace('/(app)');
  };

  const onNextButtonPress = async () => {
    try {
      const { granted } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });

      if (granted === true && pushToken !== null) {
        appManager.markAlarmOn();
        updatePushToken({ pushToken });
        router.replace({ pathname: '/(app)/alarm-time', params: { fromScreen: 'permission' } });
      } else {
        router.replace('/(app)');
      }
    } catch (error) {
      Logger('AlarmPermissionScreen').error('Failed to update pushToken', error);
    }
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <MDRow style={styles.containerSkipAppBar}>
          <MDPressable style={styles.buttonSkip} onPress={onSkipButtonPress}>
            <MDText type="labelRegular" color={colors.text.alternative}>
              건너뛰기
            </MDText>
          </MDPressable>
        </MDRow>

        <View style={styles.containerContent}>
          <View style={styles.containerSun}>
            <MDLargeSpeechBubble text="햇님이가 알림을 보내드릴게요!" />
            <Image source={require('@/assets/images/img-sun-basic.png')} style={styles.imageSun} />
          </View>
          <View style={styles.containerTitle}>
            <MDText type="titleSemiBold">알림을 허용해주세요</MDText>
            <MDText type="labelRegular" color={colors.text.alternative} align="center">
              {`꾸준히 아침일기를 쓸 수 있도록\n알림을 보내드릴게요`}
            </MDText>
          </View>
        </View>
        <View style={styles.containerFooter}>
          <MDButton title="다음" onPress={onNextButtonPress} />
        </View>
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
      alignItems: 'center',
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
    containerFooter: {
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
  });

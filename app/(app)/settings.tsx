import { MDPressable, MDSwitch, MDText } from '@/components';
import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import { useAppState } from '@/contexts/AppStateContext';
import { useNotification } from '@/contexts/NotificationContext';
import { appManager } from '@/core/storage';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import SettingSectionListItem from '@/domain/setting/SettingSectionListItem';
import { useThemeColor, useUpdatePushToken } from '@/hooks';
import { MDColors } from '@/types';
import * as Application from 'expo-application';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import semver from 'semver';

export default function SettingsScreen() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState<boolean | null>(null);

  const { pushToken } = useNotification();
  const { mutate: updatePushToken } = useUpdatePushToken();

  const { appVersion } = useAppState();

  const updateAppComponent = useMemo(() => {
    if (!appVersion) return null;

    const { android, ios } = appVersion;
    const latestVersion = Platform.select({
      android: android.version,
      ios: ios.version,
      default: null,
    });
    const currentVersion = Application.nativeApplicationVersion;

    if (!currentVersion || !latestVersion) return null;
    const isUpdateNeeded = semver.lt(currentVersion, latestVersion);

    return (
      <MDPressable
        style={styles.buttonUpdateApp}
        disabled={!isUpdateNeeded}
        onPress={() => {
          // TODO: 스토어 앱 오픈
        }}>
        <MDText
          type="bodyRegular"
          color={isUpdateNeeded ? colors.primary.normal : colors.text.alternative}>
          {isUpdateNeeded ? '업데이트 하기' : '최신 버전'}
        </MDText>
      </MDPressable>
    );
  }, [appVersion, colors, styles]);

  const navigateBack = () => {
    router.back();
  };

  const navigateToAccount = () => {
    router.push('/account');
  };

  const navigateToGoal = () => {
    router.push('/text-goal');
  };

  const navigateToAlarm = async () => {
    router.push({
      pathname: '/(app)/alarm-time',
    });
  };

  const onNavigateToWebView = () => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL: 'https://slashpage.com/morningdiary' },
    });
  };

  const onClosePermissionModal = () => {
    setShowPermissionModal(false);
  };

  const onOpenDeviceSettings = () => {
    Linking.openSettings();
    setShowPermissionModal(false);
  };

  const onAlarmToggle = async () => {
    try {
      if (isAlarmOn === true) {
        setIsAlarmOn(false);
      } else {
        const { granted, canAskAgain } = await Notifications.requestPermissionsAsync();

        if (granted === true) {
          setIsAlarmOn(true);
        }

        if (canAskAgain === false) {
          setShowPermissionModal(true);
        }
      }
    } catch (error) {
      console.error('알림 설정 중 오류:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await Notifications.getPermissionsAsync();
        const alarmOn = await appManager.checkAlarmOn();

        if (granted === true && alarmOn === true) {
          setIsAlarmOn(true);
        } else {
          setIsAlarmOn(false);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAlarmOn === null) return;

    try {
      if (isAlarmOn === true && pushToken !== null) {
        updatePushToken({ pushToken });
        appManager.markAlarmOn();
      } else {
        updatePushToken({ pushToken: null });
        appManager.clearAlarmOn();
      }
    } catch (error) {
      console.error(error);
    }
  }, [isAlarmOn, pushToken]);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <SettingAppBar title="설정" navigateBack={navigateBack} />

        <ScrollView contentContainerStyle={styles.containerContent} overScrollMode="never">
          <View>
            <SettingSection title="계정">
              <SettingSectionListItem
                label="계정 관리"
                tailComponent={
                  <Image
                    style={styles.icon}
                    source={require('@/assets/images/ic-chevron_right.png')}
                  />
                }
                onPress={navigateToAccount}
              />
            </SettingSection>

            <View style={styles.divider} />

            <SettingSection title="시스템 설정">
              <SettingSectionListItem
                label="알림"
                tailComponent={<MDSwitch checked={isAlarmOn ?? false} onChange={onAlarmToggle} />}
              />
              <SettingSectionListItem
                label="알림 시간"
                disabled={!isAlarmOn}
                tailComponent={
                  <Image
                    style={styles.icon}
                    source={require('@/assets/images/ic-chevron_right.png')}
                    tintColor={isAlarmOn ? colors.icon.normal : colors.icon.alternative}
                  />
                }
                onPress={navigateToAlarm}
              />
              <SettingSectionListItem
                label="아침일기 목표"
                tailComponent={
                  <Image
                    style={styles.icon}
                    source={require('@/assets/images/ic-chevron_right.png')}
                  />
                }
                onPress={navigateToGoal}
              />
            </SettingSection>

            <View style={styles.divider} />

            <SettingSection title="소통">
              <SettingSectionListItem
                label="개발자에게 의견 보내기"
                tailComponent={
                  <Image
                    style={styles.icon}
                    source={require('@/assets/images/ic-chevron_right.png')}
                  />
                }
                onPress={onNavigateToWebView}
              />
              <SettingSectionListItem label="리뷰 남기기" />
            </SettingSection>

            <View style={styles.divider} />

            <SettingSection title="정보">
              <SettingSectionListItem label="이용약관" />
              <SettingSectionListItem label="개인정보처리방침" />
              <SettingSectionListItem
                label={`버전 정보 ${Application.nativeApplicationVersion}`}
                disabled
                tailComponent={updateAppComponent}
              />
            </SettingSection>
          </View>
        </ScrollView>

        <MDDefaultModal
          visible={showPermissionModal}
          title={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
          negativeButton={{ text: '취소', onPress: onClosePermissionModal }}
          positiveButton={{ text: '알림 허용', onPress: onOpenDeviceSettings }}
        />
      </View>
    </SafeAreaView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerContent: {
      paddingBottom: 40,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line.normal,
      marginHorizontal: 16,
    },
    icon: {
      width: 24,
      height: 24,
    },
    buttonUpdateApp: {
      height: '100%',
      justifyContent: 'center',
    },
  });

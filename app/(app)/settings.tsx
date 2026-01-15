import { MDPressable, MDSwitch, MDText } from '@/components';
import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import { appManager } from '@/core/storage';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import SettingSectionListItem from '@/domain/setting/SettingSectionListItem';
import { useThemeColor, useUpdatePushToken } from '@/hooks';
import { MDColors } from '@/types';
import { openStoreLink } from '@/utils/links';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logger } from '@/utils/logs';
import { useAppVersion } from '@entities/version';
import crashlytics from '@react-native-firebase/crashlytics';
import { useNotificationStore } from '@shared/lib/notifications';
const APP_VARIANT = Constants.expoConfig?.extra?.appVariant;

export default function SettingsScreen() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState<boolean | null>(null);

  // const { pushToken } = useNotification();
  const pushToken = useNotificationStore((s) => s.pushToken);
  const { mutate: updatePushToken } = useUpdatePushToken();

  // const { isUpdateNeeded } = useAppState();
  const { versionStatus } = useAppVersion();
  const isUpdateNeeded = versionStatus !== 'ok';

  const UpdateAppComponent = useMemo(() => {
    return (
      <MDPressable
        style={styles.buttonUpdateApp}
        disabled={!isUpdateNeeded}
        onPress={openStoreLink}>
        <MDText
          type="bodyRegular"
          color={isUpdateNeeded ? colors.primary.normal : colors.text.alternative}>
          {isUpdateNeeded ? '업데이트 하기' : '최신 버전'}
        </MDText>
      </MDPressable>
    );
  }, [colors, styles, isUpdateNeeded]);

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

  const onNavigateToPrivacyTerms = () => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL: 'https://slashpage.com/morningdiary/xjqy1g2vwjn77m6vd54z' },
    });
  };

  const onNavigateToUseTerms = () => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL: 'https://slashpage.com/morningdiary/ywk9j72986j94mgpqvnd' },
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
      Logger('SettingsScreen').error('Failed to request permission', error);
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
        Logger('SettingsScreen').error('Failed to check alarm on', error);
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
      Logger('SettingsScreen').error('Failed to update pushToken', error);
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
              <SettingSectionListItem label="리뷰 남기기" onPress={openStoreLink} />
            </SettingSection>

            <View style={styles.divider} />

            <SettingSection title="정보">
              <SettingSectionListItem label="이용약관" onPress={onNavigateToUseTerms} />
              <SettingSectionListItem label="개인정보처리방침" onPress={onNavigateToPrivacyTerms} />
              <SettingSectionListItem
                label={`버전 정보 ${Application.nativeApplicationVersion}`}
                tailComponent={UpdateAppComponent}
              />
            </SettingSection>

            {APP_VARIANT === 'preview' && (
              <SettingSection title="테스트">
                <SettingSectionListItem
                  label="[Dev] crash test"
                  onPress={() => crashlytics().crash()}
                />
              </SettingSection>
            )}
          </View>
        </ScrollView>

        <MDDefaultModal
          visible={showPermissionModal}
          subtitle={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
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

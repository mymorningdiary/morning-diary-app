import { MDSwitch, MDText } from '@/components';
import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import { useNotification } from '@/contexts/NotificationContext';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import SettingSection from '@/domain/setting/SettingSection';
import SettingSectionListItem from '@/domain/setting/SettingSectionListItem';
import { useThemeColor, useUpdatePushToken } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isAlarmOn, setIsAlarmOn] = useState(false);

  const { pushToken } = useNotification();
  const { mutate: updatePushToken } = useUpdatePushToken();

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
      pathname: '/(notification)',
    });
  };

  const onAlarmToggle = async () => {
    if (isAlarmOn) {
      updatePushToken({ pushToken: null }); // pushToken == null -> 알림 해제
      setIsAlarmOn(false);
    } else {
      const { granted, canAskAgain } = await Notifications.requestPermissionsAsync();

      if (granted) {
        if (pushToken !== null) {
          updatePushToken({ pushToken });
        }
        setIsAlarmOn(true);
      }

      if (canAskAgain === false) {
        setShowPermissionModal(true);
      }
    }
  };

  const onClosePermissionModal = () => {
    setShowPermissionModal(false);
  };

  const onOpenDeviceSettings = () => {
    Linking.openSettings();
    setShowPermissionModal(false);
  };

  return (
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
              tailComponent={<MDSwitch checked={isAlarmOn} onChange={onAlarmToggle} />}
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
            <SettingSectionListItem label="의견 보내기" />
            <SettingSectionListItem label="리뷰 남기기" />
          </SettingSection>

          <View style={styles.divider} />

          <SettingSection title="정보">
            <SettingSectionListItem label="이용약관" />
            <SettingSectionListItem label="개인정보처리방침" />
            <SettingSectionListItem
              label="버전 정보 1.0.0"
              tailComponent={
                <MDText type="bodyRegular" color={colors.text.alternative}>
                  최신 버전
                </MDText>
              }
            />
          </SettingSection>
        </View>
      </ScrollView>

      <MDDefaultModal
        visible={showPermissionModal}
        title={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
        negativeButton={{
          text: '취소',
          onPress: onClosePermissionModal,
        }}
        positiveButton={{
          text: '알림 허용',
          onPress: onOpenDeviceSettings,
        }}
      />
    </View>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
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
  });

import * as Notifications from 'expo-notifications';
import { Linking, StyleSheet, View } from 'react-native';

import { useNotificationPreferenceStore } from '@entities/notification/model';
import { Logger } from '@shared/lib/log';
import { useNotificationStore } from '@shared/lib/notifications';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDModal } from '@shared/ui/Modal';
import { MDSwitch } from '@shared/ui/Switch';
import { MDText } from '@shared/ui/Text';
import { useEffect, useState } from 'react';
import { useForeground } from '@shared/lib/app-state';
import { useNotificationPermission } from '../model/useNotificationPermission';

export function SetNotificationListItem() {
  const colors = useThemeColor();
  const styles = ItemStyles({ colors });

  const pushToken = useNotificationStore((s) => s.pushToken);
  const { isPushOn, setIsPushOn } = useNotificationPreferenceStore();
  const { hasPermission, setHasPermission, checkPermission } = useNotificationPermission();

  const isPushSwitchOn = isPushOn && hasPermission && pushToken != null;

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handlePushToggle = async () => {
    if (isPushSwitchOn) {
      setIsPushOn(false);
    } else {
      try {
        const { granted, canAskAgain } = await Notifications.requestPermissionsAsync();
        setHasPermission(granted);

        if (granted == true) {
          setIsPushOn(true);
        }

        if (canAskAgain == false) {
          setShowPermissionModal(true);
        }
      } catch (error) {
        Logger('SetNotificationListItem').error('Failed to check notification permission', error);
      }
    }
  };

  useForeground(checkPermission);

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MDText type="bodyRegular">알림</MDText>
      <MDSwitch checked={isPushSwitchOn} onChange={handlePushToggle} />

      <MDModal
        visible={showPermissionModal}
        subtitle={'알림을 받으려면, 기기 설정에서 알림을 허용해주세요'}
        negative={{ text: '취소', onPress: () => setShowPermissionModal(false) }}
        positive={{
          text: '알림 허용',
          onPress: () => {
            Linking.openSettings();
            setShowPermissionModal(false);
          },
        }}
        onClose={() => setShowPermissionModal(false)}
      />
    </View>
  );
}

const ItemStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
  });

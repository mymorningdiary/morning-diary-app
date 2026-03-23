import { Linking, StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { MDSwitch } from '@shared/ui/Switch';
import { useSettingsNotifications } from '@pages/settings/model/useSettingsNotifications';
import { MDModal } from '@shared/ui/Modal';
import { useState } from 'react';

export function SetNotificationListItem() {
  const colors = useThemeColor();
  const styles = ItemStyles({ colors });

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const { isAlarmOn, onAlarmToggle } = useSettingsNotifications();

  return (
    <View style={styles.container}>
      <MDText type="bodyRegular">알림</MDText>
      <MDSwitch checked={isAlarmOn ?? false} onChange={onAlarmToggle} />

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

import { MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotificationPermissionScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  return (
    <View style={styles.container}>
      <MDText>Notification Permission</MDText>
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.normal,
    },
  });

import NotificationAppBar from '@/domain/notification/NotificationAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotificationScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  return (
    <View style={styles.container}>
      <NotificationAppBar option="건너띄기" />
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

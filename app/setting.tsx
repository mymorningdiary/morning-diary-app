import SettingAppBar from '@/domain/setting/AppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

export default function Setting() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <SettingAppBar navigateBack={navigateBack} />
    </View>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

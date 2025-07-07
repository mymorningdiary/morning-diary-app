import GoalAppBar from '@/domain/goal/GoalAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Goal() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      <GoalAppBar navigateBack={navigateBack} />
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerNextButton: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    containerPager: {
      flex: 1,
    },
  });

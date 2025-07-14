import AppBar from '@/domain/read-diary/AppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ReadDiaryScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const navigateBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="12월 24일 일"
        onBackButtonPress={navigateBack}
        onUpdateButtonPress={() => {}}
        onRemoveButtonPress={() => {}}
      />
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

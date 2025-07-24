import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { MDPressable, MDRow, MDText } from '@/components';
import { useMemo } from 'react';

interface Props {
  navigateBack?: () => void;
}

export default function TextGoalAppBar({ navigateBack }: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => AppBarStyles({ colors }), [colors]);

  return (
    <MDRow style={styles.container}>
      <MDText type="titleSemiBold" style={styles.title}>
        아침일기 목표
      </MDText>
      <MDPressable style={styles.buttonBack} onPress={navigateBack}>
        <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.icon} />
      </MDPressable>
    </MDRow>
  );
}

const AppBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.normal,
    },
    buttonBack: {
      height: '100%',
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
    title: {
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      color: colors.text.brand,
    },
  });

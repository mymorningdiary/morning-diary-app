import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { MDPressable, MDRow, MDText } from '@/components';
import { useMemo } from 'react';

interface AppBarProps {
  title?: string;
  onBackButtonPress?: () => void;
}

export default function NotificationAppBar({ title, onBackButtonPress }: AppBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(() => AppBarStyles({ colors }), [colors]);

  return (
    <MDRow style={styles.container}>
      {title && (
        <MDText type="titleSemiBold" style={styles.title}>
          {title}
        </MDText>
      )}
      <MDPressable style={styles.buttonBack} onPress={onBackButtonPress}>
        <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.iconBack} />
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
    iconBack: {
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

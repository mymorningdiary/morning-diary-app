import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { MDPressable, MDRow, MDText } from '@/components';
import { useMemo } from 'react';

interface AppBarProps {
  title?: string;
  option?: string;
  navigateBack?: () => void;
  onOptionButtonPress?: () => void;
}

export default function NotificationAppBar({
  title,
  option,
  navigateBack,
  onOptionButtonPress,
}: AppBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(() => appBarStyles({ colors }), [colors]);

  return (
    <MDRow style={styles.container}>
      {title && (
        <MDText type="titleSemiBold" style={styles.title}>
          {title}
        </MDText>
      )}
      {navigateBack && (
        <MDPressable style={styles.buttonBack} onPress={navigateBack}>
          <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.icon} />
        </MDPressable>
      )}
      <MDRow style={styles.containerRight}>
        {option && (
          <MDPressable style={styles.buttonOption} onPress={onOptionButtonPress}>
            <MDText type="labelRegular" color={colors.text.alternative}>
              {option}
            </MDText>
          </MDPressable>
        )}
      </MDRow>
    </MDRow>
  );
}

const appBarStyles = ({ colors }: { colors: MDColors }) =>
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
    containerRight: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    buttonOption: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingEnd: 16,
    },
  });

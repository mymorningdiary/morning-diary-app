import { Pressable, StyleSheet, View } from 'react-native';

import { IconChevronLeft, IconClose } from '@assets/icons';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';

import { MDText } from '../Text';

interface Props {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
}

export function MDAppBar({ title, onBack, onClose }: Props) {
  const colors = useThemeColor();
  const styles = AooBarStyles({ colors });

  return (
    <View style={styles.container}>
      {title && (
        <MDText type="titleSemiBold" style={styles.title} color={colors.text.brand}>
          {title}
        </MDText>
      )}
      {onBack && (
        <Pressable hitSlop={12} onPress={onBack}>
          <IconChevronLeft width={24} height={24} color={colors.icon.normal} />
        </Pressable>
      )}
      {onClose && (
        <Pressable hitSlop={12} onPress={onClose}>
          <IconClose width={24} height={24} color={colors.icon.normal} />
        </Pressable>
      )}
    </View>
  );
}

const AooBarStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 48,
      alignItems: 'center',
      backgroundColor: colors.background.normal,
      paddingHorizontal: 12,
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
    },
  });

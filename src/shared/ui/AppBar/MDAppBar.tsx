import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconChevronLeft, IconClose } from '@assets/icons';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';

import { MDText } from '../Text';

interface Props {
  title?: string;
  rightContent?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
}

export function MDAppBar({ title, rightContent, onBack, onClose }: Props) {
  const colors = useThemeColor();
  const styles = AppBarStyles({ colors });

  return (
    <View style={styles.container}>
      {title && (
        <MDText type="titleSemiBold" style={styles.title} color={colors.text.brand}>
          {title}
        </MDText>
      )}
      <View>
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

      <View>{rightContent}</View>
    </View>
  );
}

const AppBarStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 48,
      alignItems: 'center',
      backgroundColor: colors.background.normal,
      paddingHorizontal: 12,
      justifyContent: 'space-between',
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

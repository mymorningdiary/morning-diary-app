import { Pressable, StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  label: string;
  onPress?: () => void;
}

export function RequestOtpButton({ label, onPress }: Props) {
  const colors = useThemeColor();
  const styles = ButtonStyles({ colors });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <MDText type="caption2Bold" color={colors.primary.normal}>
        {label}
      </MDText>
    </Pressable>
  );
}

const ButtonStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      width: 60,
      height: 28,
      borderWidth: 2,
      borderColor: colors.primary.normal,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

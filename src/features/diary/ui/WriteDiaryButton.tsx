import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { IconPen } from '@assets/icons';

interface Props {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

export function WriteDiaryButton({ style, disabled, onPress }: Props) {
  const colors = useThemeColor();
  const styles = Styles({ colors });
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: bottom + 24 }, style]}>
      <MDButton style={styles.button} prefix={IconPen} disabled={disabled} onPress={onPress} />
    </View>
  );
}

const Styles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: 16,
    },
    button: {
      width: 56,
      height: 56,
      borderRadius: 999,
    },
  });

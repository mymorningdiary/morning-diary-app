import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconPen } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';

interface Props {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
}

export function WriteDiaryButton({ style, disabled, onPress }: Props) {
  const colors = useThemeColor();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: bottom + 24 }, style]}>
      <MDButton
        style={styles.button}
        activeBackgroundColor={colors.fill.brand}
        prefix={IconPen}
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

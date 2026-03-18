import { Platform, StyleSheet, View } from 'react-native';

import { useKeyboardHeight } from '@shared/lib/keyboard';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  currentTextLen: number;
  targetTextLen: number;
}

export function TextGoalCounter({ currentTextLen, targetTextLen }: Props) {
  const colors = useThemeColor();
  const styles = DebugStyles;
  const keyboardHeight = useKeyboardHeight();

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        Platform.OS == 'ios' && keyboardHeight > 0 && { bottom: keyboardHeight },
      ]}>
      <MDText type="caption1SemiBold" color={colors.text.alternative}>
        {`${currentTextLen} / ${targetTextLen}`}
      </MDText>
    </View>
  );
}

const DebugStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 20,
  },
});

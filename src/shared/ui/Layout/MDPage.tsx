import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { useKeyboardVisible } from '@shared/lib/keyboard';

interface MDPageProps extends SafeAreaViewProps {
  includeBottomSafeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function MDPage({ style, includeBottomSafeArea = false, edges, ...rest }: MDPageProps) {
  const colors = useThemeColor();
  const styles = MDPageStyles({ colors });
  const keyboardVisible = useKeyboardVisible();

  const insets = useSafeAreaInsets();
  const flattened = StyleSheet.flatten(style);
  const basePaddingBottom =
    typeof flattened?.paddingBottom === 'number' ? flattened.paddingBottom : undefined;

  const adjustedPadding =
    !includeBottomSafeArea && typeof basePaddingBottom === 'number'
      ? Math.max(0, basePaddingBottom - insets.bottom)
      : basePaddingBottom;

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.container,
        style,
        typeof adjustedPadding === 'number' && { paddingBottom: adjustedPadding },
        keyboardVisible && Platform.OS === 'android' && { paddingBottom: 0 },
      ]}
      {...rest}
    />
  );
}

const MDPageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

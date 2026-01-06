import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from 'react-native-safe-area-context';

interface MDPageProps extends SafeAreaViewProps {
  includeBottomSafeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function MDPage({ style, includeBottomSafeArea = false, edges, ...rest }: MDPageProps) {
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
      style={[style, typeof adjustedPadding === 'number' && { paddingBottom: adjustedPadding }]}
      {...rest}
    />
  );
}

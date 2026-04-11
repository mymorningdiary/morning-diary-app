import { View, StyleSheet } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  isFirst?: boolean;
  title: string;
}

export function DiaryListSectionHeader({ isFirst = true, title }: Props) {
  const colors = useThemeColor();

  return (
    <View style={[styles.container, isFirst && { paddingTop: 0 }]}>
      <MDText type="labelRegular" color={colors.text.brand}>
        {title}
      </MDText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingStart: 2,
    paddingBottom: 8,
  },
});

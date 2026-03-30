import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string;
  content?: string;
  date?: string;
  emotion?: number;
}

export function DiaryPreviewListItem({ style, title, content, date, emotion }: Props) {
  const colors = useThemeColor();
  const styles = Styles({ colors });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContent}></View>
    </View>
  );
}

const Styles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.fill.normal,
      borderColor: colors.line.normal,
      borderWidth: 1,
      borderRadius: 16,
    },
    titleContent: {
      flexDirection: 'row',
    },
  });

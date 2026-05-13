import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  insights?: {
    title: string;
    content: string;
  }[];
}

export function ReportInsightSection({ style, insights }: Props) {
  const colors = useThemeColor();

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <MDText type="titleSemiBold" color="#FFFFFF" style={styles.titleText}>
        내 무의식이 보낸 메시지
      </MDText>

      <View style={styles.listContent}>
        {insights.map((insight, index) => (
          <View key={`${insight.title}-${index}`} style={styles.itemContent}>
            <MDText type="bodySemiBold" color={colors.text.inversion}>
              {`🌟 ${insight.title}`}
            </MDText>

            <MDText type="bodyRegular" color={colors.text.inversion}>
              {insight.content}
            </MDText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4B392F',
    paddingHorizontal: 16,
    paddingVertical: 80,
  },
  titleText: {
    marginBottom: 40,
  },
  listContent: {
    gap: 32,
  },
  itemContent: {
    gap: 8,
  },
});

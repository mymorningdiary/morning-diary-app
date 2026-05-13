import { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

interface TopKeyword {
  word: string;
  count: number;
}

interface Props {
  style?: StyleProp<ViewStyle>;
  topKeywords?: TopKeyword[];
}

const MAX_KEYWORD_COUNT = 5;
const MIN_ROW_HEIGHT = 60;
const MAX_ROW_HEIGHT = 180;
const KEYWORD_COLORS = ['#7A2F00', '#FF8533', '#FFDC3D', '#F7DEC9', '#F7EEE7'];

export function ReportTopKeywordSection({ style, topKeywords }: Props) {
  const colors = useThemeColor();

  const sortedKeywords = useMemo(
    () =>
      [...(topKeywords ?? [])]
        .filter((keyword) => keyword.word && keyword.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_KEYWORD_COUNT),
    [topKeywords],
  );

  const maxCount = sortedKeywords[0]?.count ?? 0;

  if (sortedKeywords.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <MDText type="titleSemiBold" style={styles.titleText}>
        이번 주의 키워드
      </MDText>

      <View style={styles.chart}>
        {sortedKeywords.map((keyword, index) => {
          const rowHeight = getRowHeight(keyword.count, maxCount);

          return (
            <View
              key={`${keyword.word}-${index}`}
              style={[
                styles.keywordRow,
                {
                  height: rowHeight,
                  backgroundColor: KEYWORD_COLORS[index],
                },
              ]}>
              <MDText
                style={styles.keywordText}
                type="bodySemiBold"
                color={index === 0 ? colors.text.inversion : colors.text.normal}
                numberOfLines={1}>
                {keyword.word}
              </MDText>
              <MDText
                type="labelRegular"
                color={index === 0 ? colors.text.inversion : colors.text.normal}>
                {keyword.count}번
              </MDText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getRowHeight(count: number, maxCount: number) {
  if (maxCount <= 0) {
    return MIN_ROW_HEIGHT;
  }

  const ratio = count / maxCount;

  return MIN_ROW_HEIGHT + (MAX_ROW_HEIGHT - MIN_ROW_HEIGHT) * ratio;
}

const styles = StyleSheet.create({
  container: {},
  titleText: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chart: {
    overflow: 'hidden',
  },
  keywordRow: {
    minHeight: MIN_ROW_HEIGHT,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keywordText: {
    flex: 1,
    marginRight: 16,
  },
});

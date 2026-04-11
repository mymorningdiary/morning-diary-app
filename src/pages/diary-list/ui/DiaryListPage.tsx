import dayjs from 'dayjs';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import type { Diary } from '@entities/diary';
import { useGetDiaries } from '@entities/diary';
import { DiaryPreviewCard } from '@features/diary';
import { useThemeColor } from '@shared/lib/theme';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { DiaryListHeader } from './DiaryListHeader';

export function DiaryListPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');
  const { diary, isError, isLoading } = useGetDiaries(currentMonth);
  const diaries = diary?.diaryInfos ?? [];

  const renderDiary = ({ item }: { item: Diary }) => (
    <DiaryPreviewCard
      emotion={item.emotionScore}
      title={item.title}
      date={item.writtenDate}
      content={item.previewContent}
      titleLines={1}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContent}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary.normal} />
      ) : (
        <MDText type="labelRegular" color={colors.text.alternative} align="center">
          {isError ? '일기 목록을 불러오지 못했어요' : '작성된 일기가 없어요'}
        </MDText>
      )}
    </View>
  );

  return (
    <MDPage style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          diaries.length === 0 && styles.emptyListContent,
        ]}
        data={diaries}
        renderItem={renderDiary}
        keyExtractor={(item) => String(item.diaryId)}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListHeaderComponent={() => (
          <DiaryListHeader date={currentDate} onDateChange={setCurrentDate} />
        )}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyListContent: {
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSeparator: {
    height: 12,
  },
});

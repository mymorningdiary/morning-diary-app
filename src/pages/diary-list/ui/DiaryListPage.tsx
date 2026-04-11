import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import type { Diary } from '@entities/diary';
import { DiaryPreviewCard } from '@features/diary';
import { useThemeColor } from '@shared/lib/theme';
import { MDPage } from '@shared/ui/Layout';
import { DiaryListSection, useDiaryList } from '../model/useDiaryList';
import { DiaryListEmpty } from './DiaryListEmpty';
import { DiaryListHeader } from './DiaryListHeader';
import { DiaryListSectionHeader } from './DiaryListSectionHeader';

export function DiaryListPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');
  const { sections, isLoading, isError } = useDiaryList(currentMonth);

  const renderDiary: SectionListRenderItem<Diary, DiaryListSection> = ({ item }) => (
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
        <DiaryListEmpty
          text={isError ? '일기 목록을 불러오지 못했어요' : '작성된 아침일기가 없어요'}
        />
      )}
    </View>
  );

  return (
    <MDPage style={styles.container}>
      <DiaryListHeader date={currentDate} onDateChange={setCurrentDate} />
      <SectionList
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.emptyListContent,
        ]}
        sections={sections}
        renderItem={renderDiary}
        renderSectionHeader={({ section }) => (
          <DiaryListSectionHeader isFirst={section.index == 0} title={section.title} />
        )}
        keyExtractor={(item) => `${item.diaryId}`}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
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

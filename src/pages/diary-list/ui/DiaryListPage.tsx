import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDPage } from '@shared/ui/Layout';
import { DiaryListHeader } from './DiaryListHeader';
import { useDiaryWeeklySections } from '../model/useDiaryWeeklySections';
import { DiaryWeeklySectionHeader } from './DiaryWeeklySectionHeader';
import { DiaryListEmpty } from './DiaryListEmpty';
import { DiaryWeeklySection, DiaryWeeklySectionItem } from '../model/types';
import { DiaryWeeklyReportItem } from './DiaryListWeeklyReportItem';
import { DiaryListWeeklyDiaryItem } from './DiaryListWeeklyDiaryItem';

export function DiaryListPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentMonth = dayjs(currentDate).format('YYYY-MM');
  const { sections, isPending, isError } = useDiaryWeeklySections(currentMonth);

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<DiaryWeeklySectionItem, DiaryWeeklySection>;
  }) => <DiaryWeeklySectionHeader title={section.title} />;

  const renderItem: SectionListRenderItem<DiaryWeeklySectionItem, DiaryWeeklySection> = ({
    item,
  }) => {
    if ('weeklyReportId' in item) {
      return <DiaryWeeklyReportItem weeklyReportId={item.weeklyReportId} title={item.title} />;
    }

    return <DiaryListWeeklyDiaryItem diary={item} />;
  };

  const keyExtractor = (item: DiaryWeeklySectionItem) => {
    if ('weeklyReportId' in item) {
      return `weekly-report-${item.weeklyReportId}`;
    }

    return `diary-${item.diaryId}`;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContent}>
      {isPending ? (
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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={() => <View style={styles.sectionSeparator} />}
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
  },
  emptyListContent: {
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionSeparator: {
    height: 24,
  },
  itemSeparator: {
    height: 12,
  },
});

import { Diary } from '@entities/diary';
import { DiaryPreviewCard } from '@features/diary';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  diary: Diary;
}

export function DiaryListWeeklyDiaryItem({ style, diary }: Props) {
  return (
    <View style={styles.container}>
      <DiaryPreviewCard
        style={style}
        diaryId={diary.diaryId}
        emotion={diary.emotionScore}
        title={diary.title}
        date={diary.writtenDate}
        content={diary.previewContent}
        titleLines={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});

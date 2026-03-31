import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { DiaryPreviewCard } from '@features/diary';

export function DiaryListPage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDText>DiaryList Page</MDText>
      <DiaryPreviewCard
        emotion={5}
        title="대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자"
        date="2026-03-26"
        content="대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자 대충 긴 텍스트를 적어보자"
        titleLines={1}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

import { StyleSheet } from 'react-native';

import { DiaryPreviewCard } from '@features/diary';
import { MDPage } from '@shared/ui/Layout';
import { DatePicker } from '@shared/ui/Picker';
import dayjs from 'dayjs';
import { useState } from 'react';

export function DiaryListPage() {
  const styles = PageStyles;

  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <MDPage style={styles.container}>
      <DatePicker date={currentDate} onDateChange={setCurrentDate} />
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

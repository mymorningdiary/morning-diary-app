import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { getSingleParam } from '@shared/lib/router';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';

export function ReadDiaryPage() {
  const styles = PageStyles;

  const { date, diaryId } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const diaryIdParam = Number(getSingleParam(diaryId));
  const formattedDate = dateParam ? dayjs(dateParam).locale('ko').format('M월 D일 (ddd)') : '';

  const [showBackModal, setShowBackModal] = useState(false);

  if (!dateParam || !diaryIdParam) {
    return <Redirect href="/(app)" />;
  }

  return (
    <MDPage style={styles.container}>
      <MDAppBar title={formattedDate} onBack={() => setShowBackModal(true)} />

      <MDModal
        visible={showBackModal}
        subtitle={`일기쓰기를 종료할까요?\n종료 선택 시, 일기는 저장되지 않아요.`}
        negative={{ text: '취소', onPress: () => setShowBackModal(false) }}
        positive={{ text: '종료', onPress: () => router.back() }}
        onClose={() => setShowBackModal(false)}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {},
  progressBar: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
});

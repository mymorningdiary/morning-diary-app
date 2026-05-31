import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IconPen, IconTrash } from '@assets/icons';
import { useDeleteDiary, useGetDiary } from '@entities/diary';
import { DiaryPreviewCard } from '@features/diary';
import { useForeground } from '@shared/lib/app-state';
import { parseNumberParam } from '@shared/lib/router';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { MDText } from '@shared/ui/Text';

export function ReadDiaryPage() {
  const styles = PageStyles;

  const params = useLocalSearchParams<{
    date?: string;
    diaryId?: string;
    readOnly?: string;
  }>();
  const diaryDate = params.date != null ? dayjs(params.date) : null;
  const diaryId = parseNumberParam(params.diaryId);
  const isReadOnly = params.readOnly === 'true';

  const formattedDate = diaryDate?.locale('ko').format('M월 D일 (ddd)') ?? '';
  const [now, setNow] = useState(() => dayjs());
  const isToday = diaryDate != null && diaryDate.isValid() && diaryDate.isSame(now, 'day');

  const { diary } = useGetDiary(diaryId);
  const { deleteDiary, isPending } = useDeleteDiary({
    date: diaryDate?.format('YYYY-MM'),
    onSuccess: () => {
      router.back();
    },
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useForeground(() => {
    setNow(dayjs());
  });

  const handleDeleteDiary = () => {
    if (!diaryId || isPending) return;
    deleteDiary(diaryId);
  };

  if (!diaryDate || !diaryId) {
    return <Redirect href="/(app)/(main)" />;
  }

  return (
    <MDPage style={styles.container}>
      <MDAppBar
        title={formattedDate}
        onBack={() => router.back()}
        rightContent={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {isToday && !isReadOnly && (
              <MDButton
                style={{ width: 24 }}
                variant="ghost"
                prefix={IconPen}
                onPress={() =>
                  router.replace({
                    pathname: '/diary-update',
                    params: { date: diaryDate.format('YYYY-MM-DD'), diaryId },
                  })
                }
                hitSlop={8}
              />
            )}
            {!isReadOnly && (
              <MDButton
                style={{ width: 24 }}
                variant="ghost"
                prefix={IconTrash}
                onPress={() => setShowDeleteModal(true)}
                hitSlop={8}
              />
            )}
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View>
          {diary?.emotionScore && (
            <DiaryPreviewCard
              style={{ marginVertical: 16 }}
              emotion={diary.emotionScore}
              title={diary?.title}
            />
          )}
          {diary?.content && (
            <MDText type="bodyRegular" textBreakStrategy="highQuality">
              {diary.content}
            </MDText>
          )}
        </View>
      </ScrollView>

      <MDModal
        visible={showDeleteModal}
        subtitle={`일기를 삭제할까요?`}
        negative={{ text: '취소', onPress: () => setShowDeleteModal(false) }}
        positive={{ text: '삭제', onPress: handleDeleteDiary }}
        onClose={() => setShowDeleteModal(false)}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {},
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});

import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IconPen, IconTrash } from '@assets/icons';
import { useReadDiary } from '@entities/diary';
import { useForeground } from '@shared/lib/app-state';
import { parseNumberParam } from '@shared/lib/router';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { MDText } from '@shared/ui/Text';

export function ReadDiaryPage() {
  const styles = PageStyles;

  const { date, diaryId } = useLocalSearchParams<{ date?: string; diaryId?: string }>();
  const diaryDate = date != null ? dayjs(date) : null;
  const formattedDate = diaryDate?.locale('ko').format('M월 D일 (ddd)') ?? '';
  const { diary } = useReadDiary(parseNumberParam(diaryId));

  const [now, setNow] = useState(() => dayjs());
  const isToday = diaryDate != null && diaryDate.isValid() && diaryDate.isSame(now, 'day');

  const [showBackModal, setShowBackModal] = useState(false);

  useForeground(() => {
    setNow(dayjs());
  });

  if (!date || diaryId === undefined) {
    return <Redirect href="/(app)" />;
  }

  return (
    <MDPage style={styles.container}>
      <MDAppBar
        title={formattedDate}
        onBack={() => router.back()}
        rightContent={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {isToday && (
              <MDButton
                style={{ width: 24 }}
                variant="ghost"
                prefix={IconPen}
                onPress={() => {}}
                hitSlop={8}
              />
            )}
            <MDButton
              style={{ width: 24 }}
              variant="ghost"
              prefix={IconTrash}
              onPress={() => {}}
              hitSlop={8}
            />
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View>
          {diary?.content && (
            <MDText type="bodyRegular" textBreakStrategy="highQuality">
              {diary.content}
            </MDText>
          )}
        </View>
      </ScrollView>

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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});

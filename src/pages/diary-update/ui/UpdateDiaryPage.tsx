import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { selectTextGoal, useTextGoals } from '@entities/text-goal';
import { useUser } from '@entities/user';
import {
  DiaryAssistant,
  DiaryEditor,
  useDiaryAssistant,
  useDiaryAssistantByPause,
  useDiaryAssistantByProgress,
  useDiaryEditor,
} from '@features/diary';
import { parseNumberParam } from '@shared/lib/router';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';
import { useReadDiary } from '@entities/diary';

export function UpdateDiaryPage() {
  const styles = PageStyles;

  const editorRef = useRef<TextInput>(null);

  const params = useLocalSearchParams<{ date?: string; diaryId?: string }>();
  const diaryDate = params.date != null ? dayjs(params.date) : null;
  const diaryId = parseNumberParam(params.diaryId);

  const formattedDate = diaryDate?.locale('ko').format('M월 D일 (ddd)') ?? '';

  const { diary } = useReadDiary(diaryId);

  const { user } = useUser();
  const { textGoals } = useTextGoals();
  const userTextGoal = selectTextGoal(textGoals ?? [], user?.textGoalId);

  const { diaryState, currentTextLen, progress, setDiaryText, handleDiaryTextChange } =
    useDiaryEditor({
      initialText: diary?.content,
      textGoalLen: userTextGoal?.textLength,
    });

  const { assistantState, showAssistant, hideAssistant } = useDiaryAssistant();
  useDiaryAssistantByPause({ currentTextLen, showAssistant });
  useDiaryAssistantByProgress({ progress, showAssistant });

  const [showBackModal, setShowBackModal] = useState(false);

  const handleSubmit = () => {};

  if (!diaryDate || !diaryId) {
    return <Redirect href="/(app)" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MDPage style={styles.container}>
        <Pressable onPress={() => editorRef.current?.blur()}>
          <MDAppBar
            title={formattedDate}
            onBack={() => setShowBackModal(true)}
            rightContent={
              <MDButton
                variant="ghost"
                size="small"
                label="완료"
                disabled={currentTextLen == 0}
                onPress={handleSubmit}
              />
            }
          />

          <TextGoalProgressBar
            style={styles.progressBar}
            label="아침일기 목표"
            progress={progress}
          />
        </Pressable>

        <DiaryEditor
          inputRef={editorRef}
          {...diaryState}
          targetTextLen={userTextGoal?.textLength}
          currentTextLen={currentTextLen}
          onChangeText={handleDiaryTextChange}
          onShowAssistant={showAssistant}
        />

        <DiaryAssistant {...assistantState} onHide={hideAssistant} />

        <MDModal
          visible={showBackModal}
          subtitle={`일기쓰기를 종료할까요?\n종료 선택 시, 일기는 저장되지 않아요.`}
          negative={{ text: '취소', onPress: () => setShowBackModal(false) }}
          positive={{ text: '종료', onPress: () => router.back() }}
          onClose={() => setShowBackModal(false)}
        />
      </MDPage>
    </GestureHandlerRootView>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  progressBar: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
});

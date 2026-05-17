import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useWriteDiary } from '@entities/diary';
import { WEEKLY_REPORT_DIARY_GOAL } from '@entities/report';
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
import { getSingleParam } from '@shared/lib/router';
import { useThemeColor } from '@shared/lib/theme';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';
import { WeeklyReportGoalModal } from './WeeklyReportGoalModal';

interface DiaryWriteSuccessState {
  isFirstWritten: boolean;
  writtenTextLen: number;
}

export function WriteDiaryPage() {
  const styles = PageStyles;
  const colors = useThemeColor();

  const editorRef = useRef<TextInput>(null);

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dateParam ? dayjs(dateParam).locale('ko').format('M월 D일 (ddd)') : '';

  const { user } = useUser();
  const { textGoals } = useTextGoals();
  const userTextGoal = selectTextGoal(textGoals ?? [], user?.textGoalId);

  const { diaryState, currentTextLen, progress, handleDiaryTextChange } = useDiaryEditor({
    textGoalLen: userTextGoal?.textLength,
  });

  const { assistantState, showAssistant, hideAssistant } = useDiaryAssistant();
  useDiaryAssistantByPause({ currentTextLen, showAssistant });
  useDiaryAssistantByProgress({ progress, showAssistant });

  const [showBackModal, setShowBackModal] = useState(false);
  const [weeklyReportSuccess, setWeeklyReportSuccess] = useState<DiaryWriteSuccessState | null>(
    null,
  );

  const completeDiaryWrite = ({ isFirstWritten, writtenTextLen }: DiaryWriteSuccessState) => {
    setWeeklyReportSuccess(null);

    if (isFirstWritten) {
      router.replace({
        pathname: '/diary-first',
        params: {
          writtenTextLen,
          writtenDate: dateParam,
        },
      });
    } else {
      router.back();
    }
  };

  const { writeDiary, isPending } = useWriteDiary({
    date: dayjs(dateParam)?.format('YYYY-MM'),
    onSuccess: ({ isFirstWritten, writtenTextLen, weeklyDiaryCount }) => {
      const successState = { isFirstWritten, writtenTextLen };

      if (weeklyDiaryCount === WEEKLY_REPORT_DIARY_GOAL) {
        setWeeklyReportSuccess(successState);
        return;
      }

      completeDiaryWrite(successState);
    },
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  if (!dateParam) {
    return <Redirect href="/(app)/(main)" />;
  }

  const handleSubmit = async () => {
    if (isPending) return;
    editorRef?.current?.blur();

    try {
      await writeDiary({
        writtenDate: dateParam,
        content: diaryState.inactiveText + diaryState.activeText,
      });
    } catch {
      // Error UI is handled by useWriteDiary.onError.
    }
  };

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
                size="medium"
                label="완료"
                disabled={currentTextLen === 0}
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

        {isPending && (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={colors.primary.normal} />
          </View>
        )}

        <MDModal
          visible={showBackModal}
          subtitle={`일기쓰기를 종료할까요?\n종료 선택 시, 일기는 저장되지 않아요.`}
          negative={{ text: '취소', onPress: () => setShowBackModal(false) }}
          positive={{ text: '종료', onPress: () => router.back() }}
          onClose={() => setShowBackModal(false)}
        />

        <WeeklyReportGoalModal
          visible={weeklyReportSuccess !== null}
          onConfirm={() => {
            if (weeklyReportSuccess) {
              completeDiaryWrite(weeklyReportSuccess);
            }
          }}
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
  loadingContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

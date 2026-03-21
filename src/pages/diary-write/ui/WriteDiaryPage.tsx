import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useWriteDiary } from '@entities/diary';
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
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDModal } from '@shared/ui/Modal';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

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

  const { writeDiary, isPending } = useWriteDiary({
    onSuccess: ({ isFirstWritten, writtenTextLen }) => {
      if (isFirstWritten) {
        router.replace({
          pathname: '/first-write',
          params: {
            writtenTextLen,
            writtenDate: dateParam,
          },
        });
      } else {
        router.replace({
          pathname: '/(app)',
          params: {
            writtenDate: dateParam,
          },
        });
      }
    },
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const [showBackModal, setShowBackModal] = useState(false);

  if (!dateParam) {
    return <Redirect href="/(app)" />;
  }

  const handleSubmit = () => {
    if (isPending) return;

    writeDiary({
      writtenDate: dateParam,
      content: diaryState.inactiveText + diaryState.activeText,
    });
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

const PageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    progressBar: {
      paddingHorizontal: 14,
      paddingBottom: 24,
    },
  });

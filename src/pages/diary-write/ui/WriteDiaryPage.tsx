import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useCurrentTextGoal } from '@entities/text-goal';
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
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';
import { useWriteDiary } from '@entities/diary';
import { useToastStore } from '@shared/lib/toast';

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const editorRef = useRef<TextInput>(null);

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dateParam ? dayjs(dateParam).locale('ko').format('M월 D일 (ddd)') : '';

  const { user } = useUser();
  const { currentTextGoal } = useCurrentTextGoal(user?.textGoalId);

  const { diaryState, currentTextLen, progress, handleDiaryTextChange } = useDiaryEditor({
    textGoalLen: currentTextGoal?.textLength,
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
            onBack={() => router.back()}
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
          targetTextLen={currentTextGoal?.textLength}
          currentTextLen={currentTextLen}
          onChangeText={handleDiaryTextChange}
          onShowAssistant={showAssistant}
        />

        <DiaryAssistant {...assistantState} onHide={hideAssistant} />
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

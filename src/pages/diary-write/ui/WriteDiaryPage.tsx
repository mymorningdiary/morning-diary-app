import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import dayjs from 'dayjs';

import { getSingleParam } from '@shared/lib/router';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDButton } from '@shared/ui/Button';
import { WritingGoalProgressBar } from '@shared/ui/ProgressBar';
import { DEFAULT_TEXT_GOAL_LEN, useCurrentTextGoal } from '@entities/text-goal';
import { useUser } from '@entities/user';
import { DiaryEditor, useDiaryEditor } from '@features/diary';

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const editorRef = useRef<TextInput>(null);

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 (ddd)');

  const { user } = useUser();
  const { currentTextGoal } = useCurrentTextGoal(user?.textGoalId);
  const { diaryState, handleDiaryTextChange } = useDiaryEditor();

  const targetTextLen = currentTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN;
  const currentTextLen = diaryState.inactiveText.length + diaryState.activeText.length;
  const progress = Math.floor((currentTextLen / targetTextLen) * 100);

  const handleBlur = () => {
    editorRef.current?.blur();
  };

  return (
    <MDPage style={styles.container}>
      <Pressable onPress={handleBlur}>
        <MDAppBar
          title={formattedDate}
          onBack={() => router.back()}
          rightContent={
            <MDButton variant="ghost" size="small" label="완료" disabled={progress == 0} />
          }
        />

        <WritingGoalProgressBar
          style={styles.progressBar}
          label="아침일기 목표"
          progress={progress}
        />
      </Pressable>

      <DiaryEditor
        inputRef={editorRef}
        {...diaryState}
        targetTextLen={targetTextLen}
        currentTextLen={currentTextLen}
        onChangeText={handleDiaryTextChange}
      />
    </MDPage>
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

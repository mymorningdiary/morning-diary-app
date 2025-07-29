import { MDCol, MDProgressBar, MDText } from '@/components';
import WriteAppBar, { formatDateToAppBarTitle } from '@/components/write/WriteAppBar';
import { useGetDiary, useThemeColor } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function UpdateDiaryScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { year, month, day, diaryId } = useLocalSearchParams();
  const appBarTitle = useMemo(
    () =>
      formatDateToAppBarTitle({
        year: Number(year),
        month: Number(month),
        day: Number(day),
      }),
    [year, month, day],
  );

  const { textGoals } = useGetTextGoals();
  const { diary } = useGetDiary({ diaryId: Number(diaryId) });

  const textGoalLen = useMemo(() => {
    const textGoal = textGoals?.find((textGoal) => textGoal.isUserTextGoal);
    return textGoal?.textLength ?? 0;
  }, [textGoals]);

  const [textState, setTextState] = useState({
    active: '',
    inactive: '',
  });

  const progress = useMemo(() => {
    const totalTextCnt = textState.active.length + textState.inactive.length;
    const result = Math.floor((Math.min(totalTextCnt, textGoalLen) / textGoalLen) * 100);

    return result;
  }, [textState, textGoalLen]);

  const onCompleteButtonPress = useCallback(() => {}, []);

  useEffect(() => {
    console.log(textGoalLen);
  }, [textGoalLen]);

  useEffect(() => {
    if (!diary) return;
    setTextState({
      active: '',
      inactive: diary.content,
    });
  }, [diary]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <WriteAppBar
          date={appBarTitle}
          isCompleteButtonEnabled={progress >= 10}
          onCompleteButtonPress={onCompleteButtonPress}
          onBackButtonPress={() => router.back()}
        />

        <MDCol style={styles.containerProgressBar}>
          <MDText type="caption2Regular" style={styles.textGoal}>
            아침일기 목표
          </MDText>
          <MDProgressBar progress={progress} />
        </MDCol>
      </View>
    </GestureHandlerRootView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      paddingBottom: 40,
    },
    containerProgressBar: {
      paddingBottom: 24,
      gap: 16,
    },
    textGoal: {
      height: 20,
      alignSelf: 'center',
      backgroundColor: colors.primary.faint,
      color: colors.primary.normal,
      paddingVertical: 3.5,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
    containerScrollContent: {
      paddingHorizontal: 24,
      flexGrow: 1,
    },
    containerText: {
      flex: 1,
    },
    inactiveText: {
      color: colors.text.alternative,
    },
    textInput: {
      fontFamily: 'Pretendard-Regular',
      fontWeight: '400',
      lineHeight: 26,
      fontSize: 16,
    },
  });

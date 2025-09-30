import { MDCol, MDProgressBar, MDText, MDView } from '@/components';
import MDAssistant from '@/components/MDAssistant';
import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import MDTopNotificationModal from '@/components/Modal/MDTopNotificationModal';
import WriteAppBar, { formatDateToAppBarTitle } from '@/components/write/WriteAppBar';
import {
  ASSISTANT_SHOW_TIME,
  INACTIVATE_TEXT_TIME,
  INACTIVE_INPUT_TIME,
  INACTIVE_TEXT_LEN,
  PROGRESS_MESSAGES,
  ProgressKey,
} from '@/domain/write-diary/constants';
import { useGetDiary, useThemeColor, useUpdateDiary } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UpdateDiaryScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  const timerRef = useRef<number | null>(null);
  const lastInputTimeRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<number | null>(null);

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
  const {
    mutate: updateDiary,
    isPending: isUpdatingLoading,
    updateDiaryResponse,
  } = useUpdateDiary();

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

  const [isShowAssistant, setIsShowAssistant] = useState(false);
  const [assistantText, setAssistantText] = useState<string>('');
  const [isShowProgressAssistant, setIsShowProgressAssistant] = useState<
    Record<ProgressKey, boolean>
  >(
    Object.keys(PROGRESS_MESSAGES).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<ProgressKey, boolean>,
    ),
  );

  const [showEndModal, setShowEndModal] = useState(false);

  const onTextChange = useCallback((text: string) => {
    // 즉시 active 텍스트 업데이트
    setTextState((prev) => ({
      ...prev,
      active: text,
    }));
  }, []);

  const handleContentSizeChange = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  // 텍스트 비활성화 함수
  const inactivateText = useCallback(() => {
    if (textState.active.length > INACTIVE_TEXT_LEN) {
      const inactiveChunkCount = Math.floor(textState.active.length / INACTIVE_TEXT_LEN);
      const newInactiveText = textState.active.slice(0, INACTIVE_TEXT_LEN * inactiveChunkCount);
      const newActiveText = textState.active.slice(INACTIVE_TEXT_LEN * inactiveChunkCount);

      setTextState((prev) => ({
        active: newActiveText,
        inactive: prev.inactive + newInactiveText,
      }));
    }
  }, [textState.active]);

  const onCompleteButtonPress = useCallback(() => {
    if (isUpdatingLoading) return;

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    updateDiary({
      diaryId: Number(diaryId),
      body: {
        writtenDate: formattedDate,
        content: textState.inactive + textState.active,
      },
    });
  }, [year, month, day, textState, isUpdatingLoading, diaryId, updateDiary]);

  const showAssistant = useCallback((text: string) => {
    setAssistantText(text);
    setIsShowAssistant(true);
  }, []);

  // 어시스턴트 - 비활성화 텍스트 터치
  const onInactiveTextPress = useCallback(() => {
    showAssistant(
      '쓴 생각을 읽고 고치면 생각을 검열하게 돼요. 떠오른 생각만 쓸 수 있도록 도와줄게요 🧡',
    );
  }, [showAssistant]);

  // 어시스턴트 - 5초 부동 타이머 + 텍스트 비활성화 (부동 1.5초 후)
  useEffect(() => {
    const checkInactivity = () => {
      if (textState.active.length === 0) return;
      const now = Date.now();
      const timeSinceLastInput = now - lastInputTimeRef.current;

      if (timeSinceLastInput >= INACTIVATE_TEXT_TIME) {
        if (debounceTimerRef?.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          inactivateText();
        }, 300);
      }

      if (timeSinceLastInput >= INACTIVE_INPUT_TIME) {
        if (progress === 100) return;
        showAssistant('생각의 꼬리를 물어서 일기를 써보면 새로운 생각을 마주할 수 있어요');
        if (timerRef?.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    // 텍스트가 변경될 때마다 마지막 입력 시간 업데이트
    lastInputTimeRef.current = Date.now();

    // 이전 타이머 클리어
    if (timerRef?.current !== null) {
      clearInterval(timerRef.current);
    }

    // 새로운 타이머 설정
    timerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (timerRef?.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [textState.active, progress, showAssistant, inactivateText]);

  // 어시스턴트 - 목표율 달성
  useEffect(() => {
    const message = PROGRESS_MESSAGES[progress as keyof typeof PROGRESS_MESSAGES];
    if (message && !isShowProgressAssistant[progress as ProgressKey]) {
      showAssistant(message);
      setIsShowProgressAssistant((prev) => ({ ...prev, [progress as ProgressKey]: true }));
    }
  }, [progress, showAssistant, isShowProgressAssistant]);

  useEffect(() => {
    if (!isShowAssistant) return;

    const timer = setTimeout(() => {
      setIsShowAssistant(false);
    }, ASSISTANT_SHOW_TIME);

    return () => clearTimeout(timer);
  }, [isShowAssistant]);

  // 어시스턴트 - 5초 부동 타이머 + 텍스트 비활성화 (부동 1.5초 후)
  useEffect(() => {
    const checkInactivity = () => {
      if (textState.active.length === 0) return;
      const now = Date.now();
      const timeSinceLastInput = now - lastInputTimeRef.current;

      if (timeSinceLastInput >= INACTIVATE_TEXT_TIME) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          inactivateText();
        }, 300);
      }

      if (timeSinceLastInput >= INACTIVE_INPUT_TIME) {
        if (progress === 100) return;
        showAssistant('생각의 꼬리를 물어서 일기를 써보면 새로운 생각을 마주할 수 있어요');
        if (timerRef?.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    // 텍스트가 변경될 때마다 마지막 입력 시간 업데이트
    lastInputTimeRef.current = Date.now();

    // 이전 타이머 클리어
    if (timerRef?.current !== null) {
      clearInterval(timerRef.current);
    }

    // 새로운 타이머 설정
    timerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (timerRef?.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [textState.active, progress, showAssistant, inactivateText]);

  // 어시스턴트 - 목표율 달성
  useEffect(() => {
    const message = PROGRESS_MESSAGES[progress as keyof typeof PROGRESS_MESSAGES];
    if (message && !isShowProgressAssistant[progress as ProgressKey]) {
      showAssistant(message);
      setIsShowProgressAssistant((prev) => ({ ...prev, [progress as ProgressKey]: true }));
    }
  }, [progress, showAssistant, isShowProgressAssistant]);

  useEffect(() => {
    if (!isShowAssistant) return;

    const timer = setTimeout(() => {
      setIsShowAssistant(false);
    }, ASSISTANT_SHOW_TIME);

    return () => clearTimeout(timer);
  }, [isShowAssistant]);

  useEffect(() => {
    if (!diary) return;
    setTextState({
      active: '',
      inactive: diary.content,
    });
  }, [diary]);

  useEffect(() => {
    if (updateDiaryResponse === null) return;

    const { diaryId } = updateDiaryResponse;

    if (diaryId) {
      router.back();
    }
  }, [updateDiaryResponse]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.containerSafeArea}>
        <MDView style={styles.container}>
          <WriteAppBar
            date={appBarTitle}
            isCompleteButtonEnabled={textState.active.length + textState.inactive.length > 0}
            onCompleteButtonPress={onCompleteButtonPress}
            onBackButtonPress={() => setShowEndModal(true)}
          />

          <MDCol style={styles.containerProgressBar}>
            <MDText type="caption2Regular" style={styles.textGoal}>
              아침일기 목표
            </MDText>
            <MDProgressBar progress={progress} />
          </MDCol>

          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={insets.top}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.containerScrollContent}
              overScrollMode="never"
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={handleContentSizeChange}>
              <MDView style={styles.containerText}>
                {textState.inactive.length > 0 && (
                  <MDText
                    style={styles.inactiveText}
                    type="bodyRegular"
                    onPress={onInactiveTextPress}>
                    {textState.inactive}
                  </MDText>
                )}
                <TextInput
                  ref={textInputRef}
                  style={styles.textInput}
                  value={textState.active}
                  onChangeText={onTextChange}
                  placeholderTextColor={colors.text.alternative}
                  multiline
                  scrollEnabled={false}
                  autoFocus
                />
              </MDView>
            </ScrollView>
          </KeyboardAvoidingView>
        </MDView>

        <MDTopNotificationModal
          isVisible={isShowAssistant}
          onClose={() => setIsShowAssistant(false)}>
          <MDAssistant
            imageSource={require('@/assets/images/img-sun-basic.png')}
            text={assistantText}
          />
        </MDTopNotificationModal>

        <MDDefaultModal
          visible={showEndModal}
          title={`일기쓰기를 종료할까요?\n종료 선택 시, 일기는 저장되지 않아요.`}
          negativeButton={{ text: '계속 쓰기', onPress: () => setShowEndModal(false) }}
          positiveButton={{ text: '종료', onPress: () => router.back() }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      paddingBottom: 40 - bottomInset,
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
    keyboardAvoidingView: {
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
      color: colors.text.normal,
    },
  });

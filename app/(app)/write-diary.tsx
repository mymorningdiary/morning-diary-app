import { MDCol, MDProgressBar, MDText, MDView } from '@/components';
import MDAssistant from '@/components/MDAssistant';
import MDDefaultModal from '@/components/Modal/MDDefaultModal';
import MDTopNotificationModal from '@/components/Modal/MDTopNotificationModal';
import { WriteAppBar } from '@/components/write';
import { formatDateToAppBarTitle } from '@/components/write/WriteAppBar';
import { ASSISTANT_PAUSE_MESSAGES, WRITING_HINT_MESSAGES } from '@/constants/messages';
import {
  ASSISTANT_SHOW_TIME,
  INACTIVATE_TEXT_TIME,
  INACTIVE_INPUT_TIME,
  INACTIVE_TEXT_LEN,
  PROGRESS_MESSAGES,
  ProgressKey,
} from '@/domain/write-diary/constants';
import { useThemeColor } from '@/hooks';
import { useWriteDiary } from '@/hooks/useDiaryMutation';
import { MDColors } from '@/types';
import { getRandomMessage } from '@/utils/arrays';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WriteDiaryScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { mutate: writeDiary, isPending: isWritingLoading, writeDiaryResponse } = useWriteDiary();

  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<number | null>(null);
  const lastInputTimeRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<number | null>(null);

  const { year, month, day, textGoalLength } = useLocalSearchParams();
  const appBarTitle = useMemo(() => {
    return formatDateToAppBarTitle({
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });
  }, [year, month, day]);

  const targetTextCnt = useMemo(() => {
    return Number(textGoalLength);
  }, [textGoalLength]);

  const textInputRef = useRef<TextInput>(null);
  const [textState, setTextState] = useState({
    active: '',
    inactive: '',
  });

  const progress = useMemo(() => {
    const totalTextCnt = textState.active.length + textState.inactive.length;
    const result = Math.floor((Math.min(totalTextCnt, targetTextCnt) / targetTextCnt) * 100);

    return result;
  }, [textState, targetTextCnt]);

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

  const showAssistant = useCallback((text: string) => {
    setAssistantText(text);
    setIsShowAssistant(true);
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
    if (isWritingLoading) return;

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    writeDiary({
      writtenDate: formattedDate,
      content: textState.inactive + textState.active,
    });
  }, [year, month, day, textState, isWritingLoading, writeDiary]);

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
        showAssistant(getRandomMessage(ASSISTANT_PAUSE_MESSAGES));
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
    const progressKey = progress as ProgressKey;
    const messages = PROGRESS_MESSAGES[progressKey];

    if (messages && !isShowProgressAssistant[progressKey]) {
      showAssistant(getRandomMessage(messages));
      setIsShowProgressAssistant((prev) => ({ ...prev, [progressKey]: true }));
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
    if (writeDiaryResponse === null) return;

    const { isFirstWrittenDiary, textLength } = writeDiaryResponse;

    if (isFirstWrittenDiary) {
      router.replace({
        pathname: '/first-write',
        params: {
          textLength,
          writtenDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        },
      });
    } else {
      router.replace({
        pathname: '/(app)',
        params: {
          writtenDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        },
      });
    }
  }, [writeDiaryResponse, year, month, day]);

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
                  placeholder={getRandomMessage(WRITING_HINT_MESSAGES)}
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
      paddingBottom: 40,
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

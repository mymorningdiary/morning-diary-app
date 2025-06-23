import { MDCol, MDProgressBar, MDText, MDView } from '@/components';
import MDAssistant from '@/components/MDAssistant';
import MDTopNotificationModal from '@/components/Modal/MDTopNotificationModal';
import { WriteAppBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { useWriteDiary } from '@/hooks/useDiaryMutation';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const WORD_CNT_PER_PAGE = 300;
const INACTIVE_TEXT_LEN = 50;
const INACTIVATE_TEXT_TIME = 1500;
const INACTIVE_INPUT_TIME = 5000;
const ASSISTANT_SHOW_TIME = 3000;

const PROGRESS_MESSAGES = {
  10: '잠든 생각들을 깨워봐요',
  50: '요즘 계속 생각나는 고민이나 생각들이 있나요?',
  90: '고지가 코앞이에요',
} as const;
type ProgressKey = keyof typeof PROGRESS_MESSAGES;

export default function Write() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const { mutate: writeDiary, isPending: isWritingLoading } = useWriteDiary();

  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const lastInputTimeRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const { year, month, day } = useLocalSearchParams();
  const appBarTitle = useMemo(() => {
    return formatDateToAppBarTitle({
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });
  }, [year, month, day]);

  const { user } = useUser();
  const targetTextCnt = useMemo(() => {
    const goalPage = user?.goalPage ?? 1;
    return goalPage * WORD_CNT_PER_PAGE;
  }, [user?.goalPage]);

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
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    writeDiary({
      writtenDate: formattedDate,
      content: textState.inactive + textState.active,
    });
  }, [year, month, day, textState, writeDiary]);

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
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    // 텍스트가 변경될 때마다 마지막 입력 시간 업데이트
    lastInputTimeRef.current = Date.now();

    // 이전 타이머 클리어
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    // 새로운 타이머 설정
    timerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (timerRef.current) {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MDView style={styles.container}>
        <WriteAppBar
          date={appBarTitle}
          isCompleteButtonEnabled={progress >= 100}
          onCompleteButtonPress={onCompleteButtonPress}
          onBackButtonPress={() => router.back()}
        />

        <MDCol style={styles.containerProgressBar}>
          <MDText type="caption2Regular" style={styles.textGoal}>
            아침일기 목표
          </MDText>
          <MDProgressBar progress={progress} />
        </MDCol>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.containerScrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={handleContentSizeChange}>
          <MDView style={styles.containerText}>
            {textState.inactive.length > 0 && (
              <MDText style={styles.inactiveText} type="bodyRegular" onPress={onInactiveTextPress}>
                {textState.inactive}
              </MDText>
            )}
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={textState.active}
              onChangeText={onTextChange}
              placeholder="오늘 아침에는 어떤 생각이 떠오르나요?"
              multiline
              scrollEnabled={false}
            />
          </MDView>
        </ScrollView>
      </MDView>

      <MDTopNotificationModal isVisible={isShowAssistant} onClose={() => setIsShowAssistant(false)}>
        <MDAssistant
          imageSource={require('@/assets/images/img-sun-basic.png')}
          text={assistantText}
        />
      </MDTopNotificationModal>
    </GestureHandlerRootView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      paddingBottom: 40,
    },
    containerProgressBar: {
      paddingBottom: 24,
      gap: 16,
      // backgroundColor: 'red',
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

const formatDateToAppBarTitle = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): string => {
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  };
  const formattedDate = date.toLocaleDateString('ko-KR', options);

  return formattedDate.replace(/\./g, '').replace(/(\d+) (\d+) \((.+)\)/, '$1월 $2일 $3');
};

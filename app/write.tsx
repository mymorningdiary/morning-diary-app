import { MDProgressBar, MDRow, MDText, MDView } from '@/components';
import MDAssistant from '@/components/MDAssistant';
import MDTopNotificationModal from '@/components/Modal/MDTopNotificationModal';
import { WriteAppBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const WORD_CNT_PER_PAGE = 450;
const INACTIVE_WORD_CNT = 60;

export default function Write() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const scrollViewRef = useRef<ScrollView>(null);

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

  const [currentText, setCurrentText] = useState<string>('');
  const [inactiveText, setInactiveText] = useState<string>('');
  const [lastInputTime, setLastInputTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const progress = useMemo(() => {
    const totalTextCnt = currentText.length + inactiveText.length;
    const result = Math.floor((Math.min(totalTextCnt, targetTextCnt) / targetTextCnt) * 100);

    return result;
  }, [currentText, inactiveText, targetTextCnt]);

  const [isShowAssistant, setIsShowAssistant] = useState(false);
  const [assistantText, setAssistantText] = useState<string>('');

  const onTextChange = useCallback((text: string) => {
    setCurrentText(text);
    setLastInputTime(new Date());

    // 이전 타이머가 있다면 취소
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // 어시스턴트 - 비활성화 텍스트 터치
  const onInactiveTextPress = useCallback(() => {
    if (isShowAssistant) return;

    setAssistantText(
      '쓴 생각을 읽고 고치면 생각을 검열하게 돼요. 떠오른 생각만 쓸 수 있도록 도와줄게요 🧡',
    );
    setIsShowAssistant(true);
  }, [isShowAssistant]);

  const handleContentSizeChange = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  // 텍스트 비활성화
  useEffect(() => {
    if (currentText.length > INACTIVE_WORD_CNT) {
      const currentInactiveText = currentText.slice(0, INACTIVE_WORD_CNT);
      const restText = currentText.slice(INACTIVE_WORD_CNT);

      setCurrentText(restText);
      setInactiveText(inactiveText + currentInactiveText);
    }
  }, [currentText, inactiveText]);

  // 어시스턴트 - 5초 부동
  useEffect(() => {
    if (!lastInputTime) return;

    timerRef.current = setTimeout(() => {
      setIsShowAssistant(true);
      setAssistantText('생각의 꼬리를 물어서 일기를 써보면 새로운 생각을 마주할 수 있어요');
    }, 5000);

    // cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [lastInputTime, isShowAssistant]);

  // 모달 show -> 5초 부동 타이머 취소
  useEffect(() => {
    if (isShowAssistant && timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [isShowAssistant]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MDView style={styles.container}>
        <WriteAppBar
          date={appBarTitle}
          isCompleteButtonEnabled={progress >= 100}
          onCompleteButtonPress={() => {
            // 저장 로직
          }}
          onBackButtonPress={() => router.back()}
        />

        <MDRow style={styles.containerProgressBar}>
          <MDProgressBar progress={progress} />
          <MDText
            style={styles.textGoalPage}
            type="caption2Regular"
            onPress={() => setIsShowAssistant(true)}>
            {`${user?.goalPage ?? 0}페이지`}
          </MDText>
        </MDRow>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.containerScrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={handleContentSizeChange}>
          <MDView style={styles.containerText}>
            {inactiveText.length > 0 && (
              <MDText style={styles.inactiveText} type="bodyRegular" onPress={onInactiveTextPress}>
                {inactiveText}
              </MDText>
            )}
            <TextInput
              style={styles.textInput}
              value={currentText}
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
    },
    containerProgressBar: {
      paddingTop: 38,
      paddingBottom: 30,
      paddingEnd: 24,
      alignItems: 'center',
    },
    textGoalPage: {
      color: colors.text.brand,
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
      fontSize: 16,
      textAlignVertical: 'top',
      minHeight: 200,
      padding: 0,
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

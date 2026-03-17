import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { getSingleParam } from '@shared/lib/router';
import { MDColorsType, MDFonts, useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

import { WritingGoalProgressBar } from '@shared/ui/ProgressBar';
import dayjs from 'dayjs';
import { useUser } from '@entities/user';
import { useCurrentTextGoal } from '@entities/text-goal';
import { getRandomMessage } from '@shared/lib/random';
import { WRITING_PLACEHOLDERS } from '@features/diary';

type DiaryText = {
  inactive: string;
  active: string;
  version: number;
};

const INACTIVE_LEN = 20;
const DEFAULT_TARGET_TEXT_LEN = 200;

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 ddd');

  const { user } = useUser();
  const { currentTextGoal } = useCurrentTextGoal(user?.textGoalId);
  const targetTextLen = currentTextGoal?.textLength ?? DEFAULT_TARGET_TEXT_LEN;

  const [diaryText, setDiaryText] = useState<DiaryText>({ inactive: '', active: '', version: 0 });
  const currentTextLen = diaryText.inactive.length + diaryText.active.length;

  const progress = useMemo(
    () => Math.floor(Math.min(100, (currentTextLen / targetTextLen) * 100)),
    [currentTextLen, targetTextLen],
  );

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const handleContentSizeChange = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const inactivateText = (value: string) => {
    setDiaryText((prev) => ({
      inactive: prev.inactive + value.slice(0, INACTIVE_LEN),
      active: value.slice(INACTIVE_LEN),
      version: prev.version + 1,
    }));
  };

  const handleChangeText = (value: string) => {
    if (value.length < INACTIVE_LEN) {
      setDiaryText((prev) => ({ ...prev, active: value }));
      return;
    }

    inactivateText(value);
  };

  return (
    <MDPage style={styles.container}>
      <Pressable onPress={handleBlur}>
        <MDAppBar title={formattedDate} onBack={() => router.back()} />

        <WritingGoalProgressBar
          style={styles.progressBar}
          label="아침일기 목표"
          progress={progress}
        />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={handleContentSizeChange}>
          <Pressable style={{ flex: 1 }} onPress={handleFocus}>
            {diaryText.inactive.length > 0 && (
              <MDText
                type="bodyRegular"
                color={colors.text.alternative}
                textBreakStrategy="highQuality">
                {diaryText.inactive}
              </MDText>
            )}
            <TextInput
              key={`${diaryText.version}`}
              ref={inputRef}
              style={styles.textInput}
              value={diaryText.active}
              placeholder={currentTextLen == 0 ? getRandomMessage(WRITING_PLACEHOLDERS) : '...'}
              textBreakStrategy="highQuality"
              scrollEnabled={false}
              placeholderTextColor={colors.text.alternative}
              cursorColor={colors.primary.light}
              selectionColor={colors.primary.light}
              maxLength={INACTIVE_LEN}
              multiline
              autoFocus
              autoCorrect={false}
              allowFontScaling={false}
              onChangeText={handleChangeText}
            />
          </Pressable>
        </ScrollView>
        {process.env.APP_VARIANT !== 'production' && (
          <View pointerEvents="none" style={styles.debugTextGoal}>
            <MDText type="caption1SemiBold" color={colors.text.alternative}>
              {currentTextLen} / {targetTextLen}
            </MDText>
          </View>
        )}
      </KeyboardAvoidingView>
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
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 12,
      paddingBottom: 60,
    },
    textInput: {
      paddingVertical: 0,
      color: colors.text.normal,
      ...MDFonts['bodyRegular'],
    },

    debugTextGoal: {
      position: 'absolute',
      right: 16,
      bottom: 20,
    },
  });

/*
diaryText 에 version -> TextInput의 key
핵심 차이는 TextInput을 “같은 인스턴스 유지 + 값만 제어”하느냐, “인스턴스를 아예 교체”하느냐입니다.

지금 방식(version을 key로 사용)은 비활성화 시마다 TextInput을 완전히 새로 만듭니다. 그래서:

이전 인스턴스의 네이티브 내부 텍스트/선택 상태가 초기화됩니다.
이전 인스턴스에서 늦게 도착하던 onChange 이벤트(stale 이벤트)도 사실상 끊깁니다.
결과적으로 같은 20자 블록이 재처리되는 경로가 크게 줄어듭니다.
반대로 이전 방식들은 같은 TextInput 인스턴스를 유지해서, JS 상태는 갱신됐는데 네이티브 쪽 이벤트/내부 버퍼가 한 템포 늦게 따라오며 중복 승격이 생기기 쉬웠습니다.

즉, 지금 방식은 하드 리셋으로 동기화 문제를 원천 차단한 거고, 대가로 키보드 내려갔다 올라오는 flicker가 생기는 구조

*/

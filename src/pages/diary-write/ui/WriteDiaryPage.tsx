import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

import dayjs from 'dayjs';

type DiaryText = {
  inactive: string;
  active: string;
  version: number;
};

const INACTIVE_LEN = 20;

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 ddd');

  const [diaryText, setDiaryText] = useState<DiaryText>({ inactive: '', active: '', version: 0 });

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const handleContentSizeChange = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleChangeText = (value: string) => {
    if (value.length < INACTIVE_LEN) {
      setDiaryText((prev) => ({ ...prev, active: value }));
      return;
    }

    setDiaryText((prev) => {
      const newInactiveText = prev.inactive + value.slice(0, INACTIVE_LEN);
      const newActiveText = value.slice(INACTIVE_LEN);

      return { inactive: newInactiveText, active: newActiveText, version: prev.version + 1 };
    });
  };

  return (
    <MDPage style={styles.container}>
      <MDAppBar title={formattedDate} onBack={() => router.back()} />
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
          <View>
            {diaryText.inactive.length > 0 && (
              <MDText type="bodyRegular" color={colors.text.alternative}>
                {diaryText.inactive}
              </MDText>
            )}
            <TextInput
              key={`${diaryText.version}`}
              ref={inputRef}
              style={styles.textInput}
              value={diaryText.active}
              textBreakStrategy="simple"
              scrollEnabled={false}
              cursorColor={colors.primary.light}
              selectionColor={colors.primary.light}
              maxLength={INACTIVE_LEN}
              multiline
              autoFocus
              autoCorrect={false}
              allowFontScaling={false}
              onChangeText={handleChangeText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {},
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

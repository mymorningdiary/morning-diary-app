import dayjs from 'dayjs';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputSelectionChangeEvent,
  View,
} from 'react-native';

import { getSingleParam } from '@shared/lib/router';
import { MDFonts, useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { useRef, useState } from 'react';
import { Logger } from '@shared/lib/log';

const INACTIVE_LEN = 20;

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);

  const [text, setText] = useState('');
  const [lockIndex, setLockIndex] = useState(0);
  const inactiveText = text.slice(0, lockIndex);

  const inputRef = useRef<TextInput>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  const handleChangeText = (value: string) => {
    let newText = text;

    if (value.length < lockIndex) {
      // 비활성화 텍스트 삭제 제한
      newText = text;
    } else if (!value.startsWith(inactiveText)) {
      // 선택 삭제, 붙여넣기 제한
      newText = inactiveText + value.slice(lockIndex);
    } else {
      newText = value;
    }

    setText(newText);

    const newLockIndex = newText.length - (newText.length % INACTIVE_LEN);
    if (newLockIndex > lockIndex) {
      setLockIndex(newLockIndex);
      const nextSelection = {
        start: Math.max(selectionRef.current.start, newLockIndex),
        end: Math.max(selectionRef.current.end, newLockIndex),
      };
      selectionRef.current = nextSelection;
      requestAnimationFrame(() => {
        // lockIndex가 증가하는 순간 커서를 강제로 newLockIndex 이상으로 이동 (활성화 텍스트 중간에서 텍스트 입력 대응)
        inputRef.current?.setSelection(nextSelection.start, nextSelection.end);
      });
    }
  };

  // 비활성화 텍스트 커서 이동 제한 (props에 selection 을 주는 방식은 리렌더링을 발생시켜 텍스트 겹침이 깨짐 -> ref 활용 -> 리렌더링 X)
  const handleSelectionChange = (e: TextInputSelectionChangeEvent) => {
    const { start, end } = e.nativeEvent.selection;
    const textLen = text.length;

    if (start === end) {
      if (start < lockIndex) {
        selectionRef.current = { start: textLen, end: textLen };
        inputRef.current?.setSelection(textLen, textLen);
      } else {
        selectionRef.current = { start, end };
        inputRef.current?.setSelection(start, end);
      }
    } else {
      if (start < lockIndex) {
        selectionRef.current = { start: lockIndex, end };
        inputRef.current?.setSelection(lockIndex, end);
      } else {
        selectionRef.current = { start, end };
        inputRef.current?.setSelection(start, end);
      }
    }
  };

  if (!dayjs(dateParam).isValid()) {
    return <Redirect href="/(app)" />;
  }

  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 ddd');

  return (
    <MDPage style={styles.container}>
      <MDAppBar title={formattedDate} onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
            {/* 입력 텍스트 */}
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { color: colors.text.normal }]}
              value={text}
              textBreakStrategy="simple"
              scrollEnabled={false}
              multiline
              autoFocus
              autoCorrect={false}
              allowFontScaling={false}
              onChangeText={handleChangeText}
              onSelectionChange={handleSelectionChange}
            />
            {/* 비활성화 텍스트 */}
            <View pointerEvents="none" style={styles.inactiveOverlay}>
              <TextInput
                style={[
                  styles.textInput,
                  // { color: colors.text.alternative },
                  { color: 'red' },
                ]}
                value={inactiveText}
                textBreakStrategy="simple"
                editable={false}
                scrollEnabled={false}
                multiline
                allowFontScaling={false}
                autoCorrect={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  textInput: {
    paddingVertical: 0,
    ...MDFonts['bodyRegular'],
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

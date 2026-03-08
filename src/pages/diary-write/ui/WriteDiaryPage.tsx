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

const INACTIVE_LEN = 20;

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);

  const [text, setText] = useState('');
  const [lockIndex, setLockIndex] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const handleChangeText = (value: string) => {
    setText(value);
    const newLockIndex = value.length - (value.length % INACTIVE_LEN);
    if (newLockIndex > lockIndex) {
      setLockIndex(newLockIndex);
    }
  };

  const handleSelectionChange = (e: TextInputSelectionChangeEvent) => {
    const { start, end } = e.nativeEvent.selection;
    const newSelection = {
      start: Math.max(start, lockIndex),
      end: Math.max(end, lockIndex),
    };
    // props에 selection 을 주는 방식은 리렌더링을 발생시켜 텍스트 겹침이 깨짐 -> ref 활용 (리렌더링 X)
    inputRef.current?.setSelection(newSelection.start, newSelection.end);
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
              onChangeText={handleChangeText}
              onSelectionChange={handleSelectionChange}
              scrollEnabled={false}
              multiline
              autoFocus
              autoCorrect={false}
              allowFontScaling={false}
            />
            {/* 비활성화 텍스트 */}
            <View pointerEvents="none" style={styles.inactiveOverlay}>
              <TextInput
                style={[
                  styles.textInput,
                  // { color: colors.text.alternative },
                  { color: 'red' },
                ]}
                value={text.slice(0, lockIndex)}
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

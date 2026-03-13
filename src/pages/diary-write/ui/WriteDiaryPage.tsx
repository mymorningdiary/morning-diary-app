import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { getSingleParam } from '@shared/lib/router';
import { MDColorsType, MDFonts, useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';

import dayjs from 'dayjs';

const INACTIVE_LEN = 20;

export function WriteDiaryPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const { date } = useLocalSearchParams();
  const dateParam = getSingleParam(date);
  const formattedDate = dayjs(dateParam).locale('ko').format('M월 D일 ddd');

  const [inactiveText, setInactiveText] = useState('');
  const [activeText, setActiveText] = useState('');

  const scrollRef = useRef<ScrollView>(null);

  const handleContentSizeChange = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleChangeText = (value: string) => {
    if (value.length < INACTIVE_LEN) {
      setActiveText(value);
      return;
    }

    // activeText에서 완성된 블록만 inactiveText로 승격
    const completedLen = value.length - (value.length % INACTIVE_LEN);
    if (completedLen === 0) {
      setActiveText(value);
      return;
    }

    setInactiveText((prev) => prev + value.slice(0, completedLen));
    setActiveText(value.slice(completedLen));
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
            {inactiveText.length > 0 && (
              <Text style={[styles.textBase, styles.inactiveText]} allowFontScaling={false}>
                {inactiveText}
              </Text>
            )}
            <TextInput
              style={[styles.textBase, styles.activeText, styles.activeInput]}
              value={activeText}
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
    textBase: {
      paddingVertical: 0,
      ...MDFonts['bodyRegular'],
    },
    activeText: {
      color: colors.text.normal,
    },
    activeInput: {
      minHeight: MDFonts.bodyRegular.lineHeight,
    },
    inactiveText: {
      color: colors.text.alternative,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 12,
      paddingBottom: 60,
    },
  });

import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { TextGoalCounter } from './TextGoalCounter';

import { DEFAULT_TEXT_GOAL_LEN } from '@entities/text-goal';
import {
  ASSISTANT_INACTIVE_TEXT_MESSAGES,
  DiaryState,
  WRITING_PLACEHOLDERS,
} from '@features/diary';
import { isProduction } from '@shared/config';
import { getRandomMessage } from '@shared/lib/random';
import { MDColorsType, MDFonts, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { INACTIVE_TEXT_LEN } from '../config/constants';

interface Props extends DiaryState {
  inputRef?: React.RefObject<TextInput | null>;
  targetTextLen?: number;
  currentTextLen?: number;
  onChangeText?: (value: string) => void;
  onShowAssistant?: (message: string) => void;
}

export function DiaryEditor({
  inputRef,
  inactiveText,
  activeText,
  version,
  targetTextLen = DEFAULT_TEXT_GOAL_LEN,
  currentTextLen = 0,
  onChangeText,
  onShowAssistant,
}: Props) {
  const colors = useThemeColor();
  const styles = EditorStyles({ colors });

  const scrollRef = useRef<ScrollView>(null);

  const handleFocus = () => {
    inputRef?.current?.focus();
  };

  const handleContentSizeChange = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
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
          {inactiveText.length > 0 && (
            <MDText
              type="bodyRegular"
              color={colors.text.alternative}
              textBreakStrategy="highQuality"
              onPress={() => onShowAssistant?.(getRandomMessage(ASSISTANT_INACTIVE_TEXT_MESSAGES))}>
              {inactiveText}
            </MDText>
          )}
          <TextInput
            key={`${version}`}
            ref={inputRef}
            style={styles.textInput}
            value={activeText}
            placeholder={currentTextLen === 0 ? getRandomMessage(WRITING_PLACEHOLDERS) : '...'}
            textBreakStrategy="highQuality"
            scrollEnabled={false}
            placeholderTextColor={colors.text.alternative}
            cursorColor={colors.primary.light}
            selectionColor={colors.primary.light}
            maxLength={INACTIVE_TEXT_LEN}
            multiline
            autoFocus
            autoCorrect={false}
            allowFontScaling={false}
            onChangeText={onChangeText}
          />
        </Pressable>
      </ScrollView>
      {!isProduction && (
        <TextGoalCounter currentTextLen={currentTextLen} targetTextLen={targetTextLen} />
      )}
    </KeyboardAvoidingView>
  );
}

const EditorStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
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

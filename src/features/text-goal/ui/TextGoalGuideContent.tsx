import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { DEFAULT_TEXT_GOAL_LEN } from '@entities/text-goal';
import { useThemeColor } from '@shared/lib/theme';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';
import { MDText } from '@shared/ui/Text';

interface Props {
  style: StyleProp<ViewStyle>;
  progress?: number;
  writtenTextLen?: number;
  defaultTextGoalLen?: number;
}

export function TextGoalGuideContent({
  style,
  progress,
  writtenTextLen,
  defaultTextGoalLen = DEFAULT_TEXT_GOAL_LEN,
}: Props) {
  const colors = useThemeColor();
  const styles = ContentStyles;

  return (
    <View style={styles.container}>
      <MDText type="titleSemiBold" color={colors.text.brand} align="center">
        {`마음 속 깊은 생각을 꺼내기 위해\n`}
        <MDText type="titleSemiBold" color={colors.primary.normal}>
          {`아침일기 목표`}
        </MDText>
        {`를 정해볼까요?`}
      </MDText>

      {progress && <TextGoalProgressBar style={{ marginTop: 60 }} progress={progress} />}

      <MDText
        style={{ marginTop: 28 }}
        type="labelRegular"
        color={colors.text.alternative}
        align="center">
        {writtenTextLen && (
          <>
            {`첫 일기는 `}

            <MDText type="labelSemiBold" color={colors.text.alternative}>
              {`${writtenTextLen.toLocaleString()}`}
            </MDText>

            {`자를 썼어요\n`}
          </>
        )}

        {`한 페이지 기준은 `}

        <MDText type="labelSemiBold" color={colors.text.alternative}>
          {`${defaultTextGoalLen.toLocaleString()}`}
        </MDText>
        {`자예요`}
      </MDText>
    </View>
  );
}

const ContentStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
  },
});

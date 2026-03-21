import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { TextGoalListItem } from '@features/text-goal';
import { useUser } from '@entities/user';
import { DEFAULT_TEXT_GOAL_LEN, useUserTextGoal, useTextGoals } from '@entities/text-goal';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { getSingleParam } from '@shared/lib/router';
import { MDText } from '@shared/ui/Text';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';

export function FirstDiarySlide2() {
  const colors = useThemeColor();
  const styles = SlideStyles({ colors });

  const { writtenTextLen } = useLocalSearchParams();
  const writtenTextLenParam = getSingleParam(writtenTextLen) ?? 0;

  const { user } = useUser();
  const { userTextGoal } = useUserTextGoal(user?.textGoalId);

  const progress = Math.min(
    100,
    Math.floor(
      (Number(writtenTextLenParam) / (userTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN)) * 100,
    ),
  );

  const { textGoals, defaultTextGoal } = useTextGoals();
  const [currentTextGoalId, setCurrentTextGoalId] = useState(userTextGoal?.textGoalId ?? null);

  return (
    <View style={styles.container}>
      <View style={styles.textLenContent}>
        <MDText type="titleSemiBold" color={colors.text.brand} align="center">
          {`마음 속 깊은 생각을 꺼내기 위해\n아침일기 목표를 정해볼까요?`}
        </MDText>

        <TextGoalProgressBar style={{ marginTop: 60 }} progress={progress} />

        <MDText
          style={{ marginTop: 28 }}
          type="labelRegular"
          color={colors.text.alternative}
          align="center">
          {`첫 일기는 `}

          <MDText type="labelSemiBold" color={colors.text.alternative}>
            {`${writtenTextLenParam.toLocaleString()}`}
          </MDText>

          {`자를 썼어요\n1페이지 기준은 `}

          <MDText type="labelSemiBold" color={colors.text.alternative}>
            {`${defaultTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN}`}
          </MDText>
          {`자예요`}
        </MDText>
      </View>

      <View style={styles.textGoalContent}>
        {textGoals?.map((it) => (
          <TextGoalListItem
            key={it.textGoalId}
            id={it.textGoalId}
            title={it.title}
            option={it.option}
            isSelected={it.textGoalId === currentTextGoalId}
            onPress={() => setCurrentTextGoalId(it.textGoalId)}
          />
        ))}
      </View>
    </View>
  );
}

const SlideStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    textLenContent: {
      marginTop: 40,
      paddingHorizontal: 14,
    },
    textGoalContent: {
      paddingHorizontal: 16,
      gap: 16,
      marginBottom: 40,
    },
  });

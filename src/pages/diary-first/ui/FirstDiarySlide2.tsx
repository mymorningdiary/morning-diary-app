import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_TEXT_GOAL_LEN, selectTextGoal, useTextGoals } from '@entities/text-goal';
import { useUser } from '@entities/user';
import { TextGoalListItem } from '@features/text-goal';
import { getSingleParam } from '@shared/lib/router';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { TextGoalProgressBar } from '@shared/ui/ProgressBar';
import { MDText } from '@shared/ui/Text';

interface FirstDiarySlide2Props {
  currentTextGoalId: number | null;
  onSelectTextGoal: (textGoalId: number) => void;
}

export function FirstDiarySlide2({ currentTextGoalId, onSelectTextGoal }: FirstDiarySlide2Props) {
  const colors = useThemeColor();
  const styles = SlideStyles({ colors });

  const { writtenTextLen } = useLocalSearchParams();
  const writtenTextLenParam = getSingleParam(writtenTextLen) ?? 0;

  const { user } = useUser();
  const { textGoals, defaultTextGoal } = useTextGoals();
  const userTextGoal = selectTextGoal(textGoals ?? [], user?.textGoalId);

  const progress = Math.min(
    100,
    Math.floor(
      (Number(writtenTextLenParam) / (userTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN)) * 100,
    ),
  );

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
            onPress={() => onSelectTextGoal(it.textGoalId)}
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

import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DEFAULT_TEXT_GOAL_LEN, selectTextGoal, useTextGoals } from '@entities/text-goal';
import { useUser } from '@entities/user';
import { TextGoalGuideContent, TextGoalListItem } from '@features/text-goal';
import { getSingleParam } from '@shared/lib/router';

interface FirstDiarySlide2Props {
  currentTextGoalId: number | null;
  onSelectTextGoal: (textGoalId: number) => void;
}

export function FirstDiarySlide2({ currentTextGoalId, onSelectTextGoal }: FirstDiarySlide2Props) {
  const styles = SlideStyles;

  const { writtenTextLen } = useLocalSearchParams();
  const writtenTextLenParam = Number(getSingleParam(writtenTextLen) ?? 0);

  const { user } = useUser();
  const { textGoals, defaultTextGoal } = useTextGoals();
  const userTextGoal = selectTextGoal(textGoals ?? [], user?.textGoalId);

  const progress = Math.min(
    100,
    Math.floor((writtenTextLenParam / (userTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN)) * 100),
  );

  return (
    <View style={styles.container}>
      <TextGoalGuideContent
        style={styles.textGoalGuideContent}
        progress={progress}
        writtenTextLen={writtenTextLenParam}
        defaultTextGoalLen={defaultTextGoal?.textLength}
      />

      <View style={styles.textGoalListContent}>
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

const SlideStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textGoalGuideContent: {
    marginTop: 40,
  },
  textGoalListContent: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 40,
  },
});

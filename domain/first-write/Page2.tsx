import { MDProgressBar } from '@/components';
import { MDText } from '@/components/MDText';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import TextGoalListItem from '../text-goal/TextGoalListItem';
import { TextGoal } from '@/core/types';

type Page2Props = {
  textGoals: TextGoal[] | null;
  currentTextGoalId: number | null;
  onSelectTextGoalItem: (id: number) => void;
  writtenTextLength: number | null;
  defaultTextGoalLength: number | null;
};

export default function Page2({
  textGoals,
  currentTextGoalId,
  onSelectTextGoalItem,
  writtenTextLength,
  defaultTextGoalLength,
}: Page2Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => PageStyles({ colors }), [colors]);

  const progress = useMemo(() => {
    if (writtenTextLength === null || defaultTextGoalLength === null) {
      return null;
    }

    return Math.floor(
      (Math.min(writtenTextLength, defaultTextGoalLength) / defaultTextGoalLength) * 100,
    );
  }, [writtenTextLength, defaultTextGoalLength]);

  if (writtenTextLength === null || defaultTextGoalLength === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MDText type="titleSemiBold" color={colors.text.brand}>
        {`마음 속 깊은 생각을 꺼내기 위해\n아침일기 목표를 정해볼까요?`}
      </MDText>

      {progress && (
        <View style={styles.containerProgressBar}>
          <MDProgressBar progress={progress} text={`${writtenTextLength.toLocaleString()}자`} />
        </View>
      )}

      <MDText
        style={styles.textCenter}
        type="labelRegular"
        color={colors.text.alternative}
        align="center">
        {`첫 일기는 `}
        <MDText type="labelSemiBold" color={colors.text.alternative} align="center">
          {`${writtenTextLength.toLocaleString()}`}
        </MDText>
        {`자를 썼어요.\n1페이지 기준은 ${defaultTextGoalLength}자에요.`}
      </MDText>

      <View style={styles.containerGoal}>
        {textGoals?.map((textGoal) => (
          <TextGoalListItem
            key={textGoal.textGoalId}
            id={textGoal.textGoalId}
            textLeft={textGoal.title}
            textRight={textGoal.option}
            isSelected={textGoal.textGoalId === currentTextGoalId}
            onPress={onSelectTextGoalItem}
          />
        ))}
      </View>
    </View>
  );
}

const PageStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    containerProgressBar: {
      width: '100%',
      paddingTop: 36,
      paddingBottom: 24,
      marginTop: 24,
    },
    textCenter: {
      marginTop: 4,
    },
    containerGoal: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 16,
      gap: 16,
      justifyContent: 'flex-end',
    },
  });

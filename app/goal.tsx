import { MDButton, MDText } from '@/components';
import TextGoalListItem from '@/domain/goal/TextGoalListItem';
import GoalAppBar from '@/domain/goal/GoalAppBar';
import { useThemeColor } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUser } from '@/contexts/UserContext';

export default function Goal() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { user } = useUser();
  const { textGoals } = useGetTextGoals();
  const [currentTextGoalId, setCurrentTextGoalId] = useState<number | null>(null);

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  const onNextButtonPress = useCallback(() => {
    // TODO
  }, []);

  useEffect(() => {
    if (user === null) return;

    setCurrentTextGoalId(user.textGoalId);
  }, [user]);

  return (
    <View style={styles.container}>
      <GoalAppBar navigateBack={navigateBack} />

      <View style={styles.containerText}>
        <MDText type="titleSemiBold" color={colors.text.brand} align="center">
          {`마음 속 깊은 생각을 꺼내기 위해\n`}
          <MDText type="titleSemiBold" color={colors.primary.normal} align="center">
            {`아침일기 목표`}
          </MDText>
          {`를 정해볼까요?`}
        </MDText>

        <MDText type="labelRegular" color={colors.text.alternative} align="center">
          {`1페이지 기준은 300자에요.`}
        </MDText>
      </View>

      <View style={styles.containerBottom}>
        <View style={styles.containerGoal}>
          {textGoals?.map((textGoal) => (
            <TextGoalListItem
              key={textGoal.textGoalId}
              id={textGoal.textGoalId}
              textLeft={textGoal.title}
              textRight={`${textGoal.option === 'about' ? '약 ' : ''}${textGoal.textLength}자 ${textGoal.option === 'lte' ? '이하' : textGoal.option === 'gte' ? '이상' : ''}`}
              isSelected={textGoal.textGoalId === currentTextGoalId}
              onPress={() => setCurrentTextGoalId(textGoal.textGoalId)}
            />
          ))}
        </View>

        <View style={styles.containerNextButton}>
          <MDButton title={'완료'} onPress={onNextButtonPress} />
        </View>
      </View>
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      justifyContent: 'space-between',
    },
    containerText: {
      flex: 1,
      justifyContent: 'center',
      gap: 24,
    },
    containerBottom: {
      gap: 40,
    },
    containerGoal: {
      paddingHorizontal: 16,
      gap: 16,
    },
    containerNextButton: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
  });

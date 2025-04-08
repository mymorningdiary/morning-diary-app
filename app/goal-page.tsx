import { MDButton, MDCol, MDText, MDView } from '@/components';
import { GoalPageListItem } from '@/components/goal-page';
import { useUpdateGoalPage, useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

const MAX_GOAL_PAGE = 3;

export default function GoalPage() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const { user } = useUser();
  const [selectedGoal, setSelectedGoal] = useState(user?.goalPage ?? 0);
  const isGoWriteButtonEnabled = selectedGoal !== 0;

  const {
    mutate: updateGoalPage,
    isPending: isUpdatingGoalPage,
    isUpdateGoalPageSuccess,
  } = useUpdateGoalPage();

  const onGoWriteButtonPress = () => {
    if (!isGoWriteButtonEnabled || isUpdatingGoalPage) return;

    updateGoalPage({ goalPage: selectedGoal });
  };

  useEffect(() => {
    if (isUpdateGoalPageSuccess) {
      router.replace('/write');
    }
  }, [isUpdateGoalPageSuccess]);

  return (
    <MDCol style={styles.container}>
      <MDView style={styles.contentContainer}>
        <MDText type="titleSemiBold" style={styles.title}>
          아침일기
          <MDText type="titleSemiBold" style={{ color: colors.primary.normal }}>
            {' 목표'}
          </MDText>
          를 정해볼까요?
        </MDText>
        <MDText type="labelRegular" style={styles.subtitle}>
          {
            ' 글을 많이 쓸수록 깊은 생각을 끄집어 낼 수 있어요.\n목표는 언제든지 설정에서 바꿀 수 있어요.'
          }
        </MDText>

        <MDCol style={styles.goalPageListContainer}>
          {Array.from({ length: MAX_GOAL_PAGE }, (_, index) => (
            <GoalPageListItem
              key={index + 1}
              goal={index + 1}
              isSelected={selectedGoal === index + 1}
              onContainerPress={() => setSelectedGoal(index + 1)}
            />
          ))}
        </MDCol>
      </MDView>

      <MDView style={styles.bottomContainer}>
        <MDButton
          style={{
            backgroundColor: isGoWriteButtonEnabled
              ? colors.primary.normal
              : colors.fill.alternative,
          }}
          textStyle={{ color: isGoWriteButtonEnabled ? colors.text.inversion : colors.text.normal }}
          title={'일기쓰러 가기'}
          disabled={!isGoWriteButtonEnabled}
          onPress={onGoWriteButtonPress}
        />
      </MDView>
    </MDCol>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    contentContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    title: {
      color: colors.text.brand,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.text.alternative,
      textAlign: 'center',
      marginTop: 4,
    },
    goalPageListContainer: {
      width: '100%',
      gap: 16,
      marginTop: 24,
    },
    bottomContainer: {
      width: '100%',
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    bottomButton: {},
  });

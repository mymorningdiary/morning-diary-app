import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { TextGoalListItem } from '@features/text-goal';
import { DEFAULT_TEXT_GOAL_LEN, useTextGoals } from '@entities/text-goal';
import { useUpdateTextGoal, useUser } from '@entities/user';
import { useThemeColor } from '@shared/lib/theme';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

export function TextGoalPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { user } = useUser();
  const { textGoals, defaultTextGoal } = useTextGoals();
  const [currentTextGoalId, setCurrentTextGoalId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.textGoalId == null) return;
    setCurrentTextGoalId(user.textGoalId);
  }, [user?.textGoalId]);

  const { updateTextGoal, isPending } = useUpdateTextGoal({
    onSuccess: () => router.back(),
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const handlePress = () => {
    if (currentTextGoalId == null || isPending) return;
    updateTextGoal({ textGoalId: currentTextGoalId });
  };

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="아침일기 목표" onBack={() => router.back()} />
      <View style={{ flex: 1 }}>
        <View style={styles.textContent}>
          <MDText type="titleSemiBold" color={colors.text.brand} align="center">
            {`마음 속 깊은 생각을 꺼내기 위해\n`}
            <MDText type="titleSemiBold" color={colors.primary.normal} align="center">
              {`아침일기 목표`}
            </MDText>
            {`를 정해볼까요?`}
          </MDText>

          <MDText
            style={{ marginTop: 24 }}
            type="labelRegular"
            color={colors.text.alternative}
            align="center">
            {'한 페이지 기준은 '}

            <MDText type="labelSemiBold" color={colors.text.alternative}>
              {`${defaultTextGoal?.textLength ?? DEFAULT_TEXT_GOAL_LEN}`}
            </MDText>
            {'자예요'}
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

      <MDButton
        style={{ marginHorizontal: 16 }}
        label={'완료'}
        disabled={currentTextGoalId == null}
        loading={isPending}
        onPress={handlePress}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  textContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGoalContent: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 40,
  },
});

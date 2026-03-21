import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTextGoals } from '@entities/text-goal';
import { useUpdateTextGoal, useUser } from '@entities/user';
import { TextGoalGuideContent, TextGoalListItem } from '@features/text-goal';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';

export function TextGoalPage() {
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
        <TextGoalGuideContent
          style={styles.textGoalGuideContent}
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
  textGoalGuideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGoalListContent: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 40,
  },
});

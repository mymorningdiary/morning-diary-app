import { MDButton, MDText } from '@/components';
import TextGoalAppBar from '@/domain/text-goal/TextGoalAppBar';
import TextGoalListItem from '@/domain/text-goal/TextGoalListItem';
import { useThemeColor, useUpdateTextGoal } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TextGoalScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { textGoals } = useGetTextGoals();
  const { mutate: updateTextGoal } = useUpdateTextGoal();

  const [currentTextGoalId, setCurrentTextGoalId] = useState<number | null>(null);
  const [defaultTextGoalLength, setDefaultTextGoalLength] = useState<number | null>(null);

  const navigateBack = useCallback(() => {
    router.back();
  }, []);

  const onNextButtonPress = useCallback(() => {
    if (currentTextGoalId === null) return;

    updateTextGoal({ textGoalId: currentTextGoalId });
    router.back();
  }, [currentTextGoalId, updateTextGoal]);

  useEffect(() => {
    const userTextGoalId =
      textGoals?.find((textGoal) => textGoal.isUserTextGoal)?.textGoalId ?? null;
    setCurrentTextGoalId(userTextGoalId);

    const defaultTextGoal = textGoals?.find((textGoal) => textGoal.isDefault);
    setDefaultTextGoalLength(defaultTextGoal?.textLength ?? null);
  }, [textGoals]);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <TextGoalAppBar navigateBack={navigateBack} />

        <View style={styles.containerText}>
          <MDText type="titleSemiBold" color={colors.text.brand} align="center">
            {`마음 속 깊은 생각을 꺼내기 위해\n`}
            <MDText type="titleSemiBold" color={colors.primary.normal} align="center">
              {`아침일기 목표`}
            </MDText>
            {`를 정해볼까요?`}
          </MDText>

          {defaultTextGoalLength && (
            <MDText type="labelRegular" color={colors.text.alternative} align="center">
              {`1페이지 기준은 ${defaultTextGoalLength}자에요.`}
            </MDText>
          )}
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
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors, bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
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
      paddingBottom: 60 - bottomInset,
    },
  });

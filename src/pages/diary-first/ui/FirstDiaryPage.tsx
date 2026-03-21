import { useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { router, useLocalSearchParams } from 'expo-router';

import { StyleSheet, View } from 'react-native';
import { useUpdateTextGoal, useUser } from '@entities/user';
import { getSingleParam } from '@shared/lib/router';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDButton } from '@shared/ui/Button';
import { DotIndicator } from '@shared/ui/Pagination/DotIndicator';
import { FirstDiarySlide1 } from './FirstDiarySlide1';
import { FirstDiarySlide2 } from './FirstDiarySlide2';

export function FirstDiaryPage() {
  const styles = PageStyles;
  const sliderRef = useRef<PagerView>(null);

  const { writtenDate } = useLocalSearchParams();
  const writtenDateParam = getSingleParam(writtenDate);
  const { user } = useUser();
  const [currentTextGoalId, setCurrentTextGoalId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.textGoalId == null) return;
    setCurrentTextGoalId((prev) => prev ?? user.textGoalId);
  }, [user?.textGoalId]);

  const { updateTextGoal, isPending } = useUpdateTextGoal({
    onSuccess: () => {},
    onError: (message) => useToastStore.getState().show({ type: 'error', message }),
  });

  const slides = [
    { key: 'slide1', buttonLabel: '나만의 일기 스타일 고르기', component: <FirstDiarySlide1 /> },
    {
      key: 'slide2',
      buttonLabel: '완료',
      component: (
        <FirstDiarySlide2
          currentTextGoalId={currentTextGoalId}
          onSelectTextGoal={setCurrentTextGoalId}
        />
      ),
    },
  ];

  const [currentPosition, setCurrentPosition] = useState(0);
  const isLastSlide = currentPosition === slides.length - 1;
  const isButtonDisabled = isLastSlide && currentTextGoalId == null;
  const isButtonLoading = isLastSlide && isPending;

  const navigateToHome = () => {
    if (writtenDateParam) {
      router.replace({ pathname: '/(app)', params: { writtenDate: writtenDateParam } });
      return;
    }

    router.replace('/(app)');
  };

  const handlePagination = async () => {
    if (!isLastSlide) {
      sliderRef.current?.setPage(currentPosition + 1);
      return;
    }

    if (currentTextGoalId == null || isPending) return;

    try {
      await updateTextGoal({ textGoalId: currentTextGoalId });
      navigateToHome();
    } catch {
      // Error toast is handled in useUpdateTextGoal option.
    }
  };

  return (
    <MDPage style={styles.container}>
      <MDAppBar onBack={() => router.back()} />
      <DotIndicator style={styles.dotIndicator} position={currentPosition} count={slides.length} />

      <PagerView
        ref={sliderRef}
        style={{ flex: 1 }}
        onPageSelected={({ nativeEvent }) => setCurrentPosition(nativeEvent.position)}>
        {slides.map((slide) => (
          <View key={slide.key} style={{ flex: 1 }}>
            {slide.component}
          </View>
        ))}
      </PagerView>

      <MDButton
        style={{ marginHorizontal: 16 }}
        label={slides[currentPosition].buttonLabel}
        disabled={isButtonDisabled}
        loading={isButtonLoading}
        onPress={handlePagination}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  dotIndicator: {
    marginTop: 40,
  },
});

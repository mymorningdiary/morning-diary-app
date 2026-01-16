import { MDPage } from '@shared/ui/MDPage';
import { StyleSheet, View } from 'react-native';
import { OnboardingSlideIndicator } from './OnboardingSlideIndicator';
import { useRef, useState } from 'react';
import { OnboardingSlider } from './OnboardingSlider';
import { MDButton } from '@shared/ui/MDButton';
import PagerView from 'react-native-pager-view';
import { useVisit } from '@features/onboarding';
import { router } from 'expo-router';

export const SLIDE_CNT = 2;

export function OnboardingPage() {
  const styles = PageStyles;
  const sliderRef = useRef<PagerView | null>(null);

  const { markVisited } = useVisit();
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleNextButtonPress = () => {
    if (currentPosition < SLIDE_CNT - 1) {
      const next = currentPosition + 1;

      setCurrentPosition(next);
      sliderRef.current?.setPage(next);
    } else {
      markVisited();
      router.replace('/login');
    }
  };

  return (
    <MDPage style={styles.container}>
      <OnboardingSlideIndicator position={currentPosition} />
      <OnboardingSlider ref={sliderRef} onSwipe={(p) => setCurrentPosition(p)} />

      <MDButton
        style={{ marginHorizontal: 16 }}
        fullWidth={false}
        label={currentPosition === SLIDE_CNT - 1 ? '완료' : '다음'}
        onPress={handleNextButtonPress}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
  },
});

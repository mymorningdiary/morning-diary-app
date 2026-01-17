import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { useVisit } from '@features/onboarding';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';

import { OnboardingSlideIndicator } from './OnboardingSlideIndicator';
import { OnboardingSlider } from './OnboardingSlider';
import { OnboardingSlide1 } from './OnboardingSlide1';
import { OnboardingSlide2 } from './OnboardingSlide2';

export function OnboardingPage() {
  const styles = PageStyles;
  const sliderRef = useRef<PagerView | null>(null);

  const slides = [
    { key: 'slide1', buttonLabel: '다음', component: <OnboardingSlide1 /> },
    { key: 'slide2', buttonLabel: '시작하기', component: <OnboardingSlide2 /> },
  ];

  const { markVisited } = useVisit();
  const [currentPosition, setCurrentPosition] = useState(0);
  const currentButtonLabel = slides[Math.min(currentPosition, slides.length - 1)].buttonLabel;

  const handleNextButtonPress = () => {
    if (currentPosition < slides.length - 1) {
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
      <OnboardingSlideIndicator position={currentPosition} count={slides.length} />
      <OnboardingSlider
        sliderRef={sliderRef}
        slides={slides}
        onSwipe={(p) => setCurrentPosition(p)}
      />

      <MDButton
        style={{ marginHorizontal: 16 }}
        fullWidth={false}
        label={currentButtonLabel}
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

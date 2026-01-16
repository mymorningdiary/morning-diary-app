import { MDPage } from '@shared/ui/MDPage';
import { StyleSheet } from 'react-native';
import { OnboardingSlideIndicator } from './OnboardingSlideIndicator';
import { useState } from 'react';
import { OnboardingSlider } from './OnboardingSlider';

export const SLIDE_CNT = 2;

export function OnboardingPage() {
  const styles = PageStyles;

  const [currentPosition, setCurrentPosition] = useState(0);

  return (
    <MDPage style={styles.container}>
      <OnboardingSlideIndicator position={currentPosition} />
      <OnboardingSlider position={currentPosition} onSwipe={(p) => setCurrentPosition(p)} />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  buttonContent: {
    paddingHorizontal: 16,
  },
});

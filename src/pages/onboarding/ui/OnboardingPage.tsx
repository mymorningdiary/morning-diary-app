import { useVisit } from '@features/onboarding';
import { MDButton } from '@shared/ui/MDButton';
import { MDPage } from '@shared/ui/MDPage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { OnboardingSlideIndicator } from './OnboardingSlideIndicator';
import { OnboardingSlider } from './OnboardingSlider';
import { SLIDE_CNT } from '../model/constants';

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
      <OnboardingSlider sliderRef={sliderRef} onSwipe={(p) => setCurrentPosition(p)} />

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

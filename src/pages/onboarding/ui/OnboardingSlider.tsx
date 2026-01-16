import { RefObject } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

import { OnboardingSlide1 } from './OnboardingSlide1';
import { OnboardingSlide2 } from './OnboardingSlide2';

interface Props {
  sliderRef?: RefObject<PagerView | null>;
  onSwipe?: (position: number) => void;
}

export function OnboardingSlider({ sliderRef, onSwipe }: Props) {
  const styles = SliderStyles;

  return (
    <PagerView
      ref={sliderRef}
      style={styles.container}
      onPageSelected={({ nativeEvent }) => onSwipe?.(nativeEvent.position)}>
      <OnboardingSlide1 key="1" />
      <OnboardingSlide2 key="2" />
    </PagerView>
  );
}

const SliderStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

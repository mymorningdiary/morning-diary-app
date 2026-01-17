import { ReactNode, RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

interface SlideItem {
  key: string;
  component: ReactNode;
}

interface Props {
  sliderRef?: RefObject<PagerView | null>;
  slides: SlideItem[];
  onSwipe?: (position: number) => void;
}

export function OnboardingSlider({ sliderRef, slides, onSwipe }: Props) {
  const styles = SliderStyles;

  return (
    <PagerView
      ref={sliderRef}
      style={styles.container}
      onPageSelected={({ nativeEvent }) => onSwipe?.(nativeEvent.position)}>
      {slides.map((slide) => (
        <View key={slide.key} style={styles.slideBox}>
          {slide.component}
        </View>
      ))}
    </PagerView>
  );
}

const SliderStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideBox: {
    flex: 1,
  },
});

import { RefObject } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { OnboardingSlide1 } from './OnboardingSlide1';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';

interface Props {
  ref?: RefObject<PagerView | null>;
  onSwipe?: (position: number) => void;
}

export function OnboardingSlider({ ref, onSwipe }: Props) {
  const colors = useThemeColor();
  const styles = SliderStyles({ colors });

  return (
    <PagerView
      ref={ref}
      style={styles.container}
      onPageSelected={({ nativeEvent }) => onSwipe?.(nativeEvent.position)}>
      <OnboardingSlide1 key="1" />
      <View key="2" style={{ backgroundColor: 'blue' }}>
        <Text>2</Text>
      </View>
    </PagerView>
  );
}

const SliderStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    slide: {
      backgroundColor: 'red',
    },
  });

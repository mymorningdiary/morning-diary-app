import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

interface Props {
  position: number;
  onSwipe: (position: number) => void;
}

export function OnboardingSlider({ onSwipe }: Props) {
  const colors = useThemeColor();
  const styles = SliderStyles({ colors });

  return (
    <PagerView
      style={styles.container}
      onPageSelected={({ nativeEvent }) => onSwipe(nativeEvent.position)}>
      <View key="1" style={{ backgroundColor: 'red' }}>
        <Text>1</Text>
      </View>
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

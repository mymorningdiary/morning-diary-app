import { MDColors } from '@/types';
import { MDRow } from './MDRow';
import { MDView } from './MDView';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks';

type MDDotIndicatorProps = {
  count: number;
  currentIndex: number;
  activeColor?: string;
  inactiveColor?: string;
};

export default function MDDotIndicator({
  count,
  currentIndex,
  activeColor,
  inactiveColor,
}: MDDotIndicatorProps) {
  const colors = useThemeColor();
  const styles = IndicatorStyles({ colors, activeColor, inactiveColor });

  return (
    <MDRow style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
      ))}
    </MDRow>
  );
}

const IndicatorStyles = ({
  colors,
  activeColor,
  inactiveColor,
}: {
  colors: MDColors;
  activeColor?: string;
  inactiveColor?: string;
}) =>
  StyleSheet.create({
    container: {
      height: 8,
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: inactiveColor ?? colors.fill.alternative,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: activeColor ?? colors.primary.normal,
    },
  });

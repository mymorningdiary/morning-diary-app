import { MDColors } from '@/types';
import { MDView } from '../MDView';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks';
import { MDText } from '../MDText';
import { useMemo } from 'react';

type SpeechBubbleProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

export const SpeechBubble = ({ text, style }: SpeechBubbleProps) => {
  const colors = useThemeColor();
  const styles = useMemo(() => speechBubbleStyles({ colors }), [colors]);

  return (
    <MDView style={[styles.container, style]}>
      <MDView style={styles.textContainer}>
        <MDText style={styles.text} type={'caption2Bold'}>
          {text}
        </MDText>
      </MDView>
      <MDView style={styles.triangleContainer}>
        <MDView style={styles.triangleBorder}></MDView>
        <MDView style={styles.triangle}></MDView>
      </MDView>
    </MDView>
  );
};

const speechBubbleStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {},
    textContainer: {
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3.5,
      backgroundColor: colors.fill.normal,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    text: {
      color: colors.text.brand,
    },
    triangleContainer: {
      alignItems: 'center',
      position: 'relative',
      marginTop: -1,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderBottomWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.fill.normal,
      transform: [{ rotate: '180deg' }],
    },
    triangleBorder: {
      position: 'absolute',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderBottomWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.line.alternative,
      transform: [{ rotate: '180deg' }],
    },
  });

import { MDColors } from '@/types';
import { MDView } from '../MDView';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks';
import { MDText } from '../MDText';
import { useMemo } from 'react';

type MDLargeSpeechBubbleProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

export const MDLargeSpeechBubble = ({ text, style }: MDLargeSpeechBubbleProps) => {
  const colors = useThemeColor();
  const styles = useMemo(() => SpeechBubbleStyles({ colors }), [colors]);

  return (
    <MDView style={style}>
      <MDView style={styles.textContainer}>
        <MDText style={styles.text} type={'labelSemiBold'}>
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

const SpeechBubbleStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    textContainer: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderBottomWidth: 12,
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
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 14,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.line.alternative,
      transform: [{ rotate: '180deg' }],
    },
  });

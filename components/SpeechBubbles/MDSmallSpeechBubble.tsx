import { MDColors } from '@/types';
import { MDView } from '../MDView';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks';
import { MDText } from '../MDText';
import { useMemo } from 'react';

type MDSmallSpeechBubbleProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

export const MDSmallSpeechBubble = ({ text, style }: MDSmallSpeechBubbleProps) => {
  const colors = useThemeColor();
  const styles = useMemo(() => SpeechBubbleStyles({ colors }), [colors]);

  return (
    <MDView style={style}>
      <MDView style={styles.containerText}>
        <MDText style={styles.text} type={'caption2Bold'} numberOfLines={1}>
          {text}
        </MDText>
      </MDView>
      <MDView style={styles.containerTriangle}>
        <MDView style={styles.triangleBorder}></MDView>
        <MDView style={styles.triangle}></MDView>
      </MDView>
    </MDView>
  );
};

const SpeechBubbleStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerText: {
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.fill.normal,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    text: {
      color: colors.text.brand,
    },
    containerTriangle: {
      alignItems: 'center',
      position: 'relative',
      marginTop: -1,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 4.5,
      borderRightWidth: 4.5,
      borderBottomWidth: 7,
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
      borderLeftWidth: 5.5,
      borderRightWidth: 5.5,
      borderBottomWidth: 9,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.line.alternative,
      transform: [{ rotate: '180deg' }],
    },
  });

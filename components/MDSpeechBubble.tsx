import { MDColors } from '@/types';
import { MDView } from './MDView';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks';
import { MDText } from './MDText';
import { useMemo } from 'react';

type MDSpeechBubbleProps = {
  text: string;
  size: 'small' | 'large';
};

export const MDSpeechBubble = ({ text, size = 'large' }: MDSpeechBubbleProps) => {
  const colors = useThemeColor();
  const styles = useMemo(() => speechBubbleStyles({ colors, size }), [colors, size]);

  return (
    <MDView style={styles.container}>
      <MDView style={styles.textContainer}>
        <MDText style={styles.text} type={size === 'small' ? 'caption1SemiBold' : 'labelSemiBold'}>
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

const speechBubbleStyles = ({ colors, size }: { colors: MDColors; size: 'small' | 'large' }) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    textContainer: {
      alignItems: 'center',
      paddingHorizontal: size === 'small' ? 12 : 16,
      paddingVertical: size === 'small' ? 4 : 8,
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
      borderLeftWidth: size === 'small' ? 4 : 7,
      borderRightWidth: size === 'small' ? 4 : 7,
      borderBottomWidth: size === 'small' ? 8 : 12,
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
      borderLeftWidth: size === 'small' ? 5 : 8,
      borderRightWidth: size === 'small' ? 5 : 8,
      borderBottomWidth: size === 'small' ? 10 : 14,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.line.alternative,
      transform: [{ rotate: '180deg' }],
    },
  });

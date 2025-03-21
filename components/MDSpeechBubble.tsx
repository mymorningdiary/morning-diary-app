import { MDColors } from '@/types';
import { MDView } from './MDView';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks';
import { MDText } from './MDText';

type MDSpeechBubbleProps = {
  text: string;
};

export const MDSpeechBubble = ({ text }: MDSpeechBubbleProps) => {
  const colors = useThemeColor();
  const styles = speechBubbleStyles({ colors });

  return (
    <MDView style={styles.container}>
      <MDView style={styles.textContainer}>
        <MDText style={styles.text} type="labelSemiBold">
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
    container: {
      alignItems: 'center',
    },
    textContainer: {
      alignItems: 'center',
      minWidth: 100,
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
      position: 'relative', // 추가
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

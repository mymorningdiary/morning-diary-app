import { MDColors } from '@/types';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { useMemo } from 'react';
import { MDText } from './MDText';

interface Props {
  style?: StyleProp<ViewStyle>;
  text: string;
  align?: TextStyle['textAlign'];
}

export const SpeechBubble = ({ style, text, align }: Props) => {
  const colors = useThemeColor();
  const styles = useMemo(() => SpeechBubbleStyles({ colors }), [colors]);

  return (
    <View style={style}>
      <View style={styles.content}>
        <MDText type="labelSemiBold" color={colors.text.brand} align={align}>
          {text}
        </MDText>
      </View>
      <View style={styles.triangleContent}>
        <View style={styles.triangleBorder}></View>
        <View style={styles.triangle}></View>
      </View>
    </View>
  );
};

const SpeechBubbleStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.fill.normal,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    triangleContent: {
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

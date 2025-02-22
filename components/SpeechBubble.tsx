import { MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SpeechBubbleProps {
  text: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 1,
  borderRadius = 20,
}) => {
  const colors = useThemeColor();
  const styles = speechBubbleStyles({
    backgroundColor: backgroundColor ?? colors.fill.normal,
    borderColor: borderColor ?? colors.line.alternative,
    borderWidth,
    borderRadius,
    textColor: textColor ?? colors.text.brand,
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <MDText type="labelSemiBold" style={styles.text}>
          {text}
        </MDText>
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrowFill} />
    </View>
  );
};

const speechBubbleStyles = ({
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  textColor,
}: {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  textColor: string;
}) =>
  StyleSheet.create({
    container: {
      maxWidth: '80%',
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      borderColor: borderColor,
    },
    bubble: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    text: {
      color: textColor,
    },
    arrowBorder: {
      position: 'absolute',
      bottom: -12,
      alignSelf: 'center',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 7,
      borderRightWidth: 7,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: borderColor,
    },
    arrowFill: {
      position: 'absolute',
      bottom: -(12 - borderWidth),
      alignSelf: 'center',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 7 - borderWidth,
      borderRightWidth: 7 - borderWidth,
      borderTopWidth: 12 - borderWidth,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: backgroundColor,
    },
  });

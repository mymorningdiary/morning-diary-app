import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { MDView } from '../MDView';
import { SpeechBubble } from './SpeechBubble';

type WriteProgressBarProps = {
  progress: number;
};

export default function WriteProgressBar({ progress }: WriteProgressBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(() => progressBarStyles({ colors }), [colors]);

  return (
    <MDView style={styles.wrapper}>
      <MDView style={styles.container}>
        <MDView style={[styles.fill, { width: `${progress}%` }]} />
        <WriteProgressBarThumb progress={100} />
      </MDView>
    </MDView>
  );
}

const progressBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingHorizontal: 24,
    },
    container: {
      height: 16,
      borderRadius: 12,
      backgroundColor: colors.fill.alternative,
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary.light,
      borderRadius: 12,
    },
  });

function WriteProgressBarThumb({ progress }: { progress: number }) {
  const colors = useThemeColor();
  const styles = useMemo(() => progressBarThumbStyles({ colors, progress }), [colors, progress]);

  return (
    <MDView style={styles.container}>
      <SpeechBubble text={`${progress}%`} style={styles.speechBubble} />
      <Image style={styles.image} source={require('@/assets/images/img-sun-mini.png')} />
    </MDView>
  );
}

const progressBarThumbStyles = ({ colors, progress }: { colors: MDColors; progress: number }) =>
  StyleSheet.create({
    container: {
      width: 40,
      height: 40,
      position: 'absolute',
      alignItems: 'center',
      top: 0,
      left: `${progress}%`,
      transform: [{ translateX: -20 }, { translateY: -12 }],
    },
    speechBubble: {
      position: 'absolute',
      bottom: 40,
    },
    image: {
      width: 40,
      height: 40,
      backgroundColor: 'green',
    },
  });

import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MDSpeechBubble } from '../MDSpeechBubble';
import { MDView } from '../MDView';

type WriteProgressBarProps = {
  progress: number;
};

export default function WriteProgressBar({ progress }: WriteProgressBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(() => progressBarStyles({ colors }), [colors]);

  return (
    <MDView style={styles.container}>
      <MDView style={[styles.fill, { width: `${progress}%` }]} />
      <WriteProgressBarThumb progress={progress} />
    </MDView>
  );
}

const progressBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: 17,
      backgroundColor: colors.fill.alternative,
      borderRadius: 12,
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
      <MDSpeechBubble text={`${progress}%`} size="small" />
      <Image style={styles.image} source={require('@/assets/images/img-sun-mini.png')} />
    </MDView>
  );
}

const progressBarThumbStyles = ({ colors, progress }: { colors: MDColors; progress: number }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: `${progress}%`,
      transform: [{ translateX: -22 }, { translateY: 8.5 }],
      alignItems: 'center',
      bottom: 0,
    },
    image: {
      width: 38,
      height: 40,
    },
  });

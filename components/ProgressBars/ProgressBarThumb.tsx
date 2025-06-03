import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { MDView } from '../MDView';
import { MDSmallSpeechBubble } from '../SpeechBubbles/MDSmallSpeechBubble';

export default function ProgressBarThumb({ progress }: { progress: number }) {
  const colors = useThemeColor();
  const styles = useMemo(() => ThumbStyles({ colors, progress }), [colors, progress]);

  return (
    <MDView style={styles.container}>
      <MDSmallSpeechBubble text={`${progress}%`} style={styles.speechBubble} />
      <Image style={styles.image} source={require('@/assets/images/img-sun-mini.png')} />
    </MDView>
  );
}

const ThumbStyles = ({ colors, progress }: { colors: MDColors; progress: number }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignItems: 'center',
      top: 0,
      left: `${progress}%`,
      transform: [{ translateX: -20 }, { translateY: -12 }],
    },
    speechBubble: {
      minWidth: 40 + progress * 0.12, // 0 -> 40, 100 -> 52
      position: 'absolute',
      bottom: 37, // image 와 간격 4px
    },
    image: {
      width: 40,
      height: 40,
    },
  });

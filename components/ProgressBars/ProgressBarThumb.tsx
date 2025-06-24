import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { MDView } from '../MDView';
import { MDSmallSpeechBubble } from '../SpeechBubbles/MDSmallSpeechBubble';

export default function ProgressBarThumb({ progress }: { progress: number }) {
  const styles = useMemo(() => ThumbStyles({ progress }), [progress]);

  return (
    <MDView style={styles.container}>
      <MDSmallSpeechBubble text={`${progress}%`} style={styles.speechBubble} />
      <Image style={styles.image} source={require('@/assets/images/img-sun-small.png')} />
    </MDView>
  );
}

const ThumbStyles = ({ progress }: { progress: number }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignItems: 'center',
      top: 0,
      left: `${(progress / 100) * 94}%`, // max 94
      transform: [{ translateX: -6 }, { translateY: -12 }],
    },
    speechBubble: {
      position: 'absolute',
      top: -24, // image 와 간격 3px
      minWidth: 40 + progress * 0.1, // 0 -> 40, 100 -> 50
    },
    image: {
      width: 36,
      height: 36,
    },
  });

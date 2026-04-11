import { SpeechBubble } from '@shared/ui/Text';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

import { ImgBook } from '@assets/images';

interface Props {
  text?: string;
}

export function DiaryListEmpty({ text = '작성된 아침일기가 없어요' }: Props) {
  return (
    <View style={styles.container}>
      <SpeechBubble text={text} />
      <Image style={styles.image} source={ImgBook} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  image: {
    width: 160,
    height: 130,
  },
});

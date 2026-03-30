import { StyleProp, ImageStyle } from 'react-native';
import { Image } from 'expo-image';

import { ImgEmotion1, ImgEmotion2, ImgEmotion3, ImgEmotion4, ImgEmotion5 } from '@assets/images';

const selectEmotionImage = (emotion: number) => {
  if (emotion <= 20) {
    return ImgEmotion1;
  }
  if (emotion <= 40) {
    return ImgEmotion2;
  }
  if (emotion <= 60) {
    return ImgEmotion3;
  }
  if (emotion <= 80) {
    return ImgEmotion4;
  }
  if (emotion <= 100) {
    return ImgEmotion5;
  }
};

interface Props {
  style?: StyleProp<ImageStyle>;
  emotion: number;
}

export function DiaryEmotionImage({ emotion, style }: Props) {
  const source = selectEmotionImage(emotion);

  if (!source) {
    return null;
  }

  return <Image style={style} source={source} />;
}

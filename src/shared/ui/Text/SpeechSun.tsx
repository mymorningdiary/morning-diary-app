import { ComponentProps } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { ImgSunBasic } from '@assets/images';
import { SpeechBubble } from './SpeechBubble/SpeechBubble';

interface Props {
  style?: StyleProp<ViewStyle>;
  text?: string;
  image?: ComponentProps<typeof Image>['source'];
  imageSize?: number;
}

export function SpeechSun({ style, text, image = ImgSunBasic, imageSize = 120 }: Props) {
  const styles = SunStyles;

  return (
    <View style={[styles.container, style]}>
      {text && <SpeechBubble text={text} align="center" />}
      <Image style={{ width: imageSize, height: imageSize }} contentFit="contain" source={image} />
    </View>
  );
}

const SunStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});

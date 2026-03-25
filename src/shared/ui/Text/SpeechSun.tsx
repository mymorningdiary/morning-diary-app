import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ImgSunBasic } from '@assets/images';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { Image } from 'expo-image';
import { ComponentProps } from 'react';
import { SpeechBubble } from './SpeechBubble/SpeechBubble';

interface Props {
  style?: StyleProp<ViewStyle>;
  text?: string;
  image?: ComponentProps<typeof Image>['source'];
  imageSize?: number;
}

export function SpeechSun({ style, text, image = ImgSunBasic, imageSize = 120 }: Props) {
  const colors = useThemeColor();
  const styles = Styles({ colors });

  return (
    <View style={[styles.container, style]}>
      {text && <SpeechBubble text={text} align="center" />}
      <Image style={{ width: imageSize, height: imageSize }} contentFit="contain" source={image} />
    </View>
  );
}

const Styles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

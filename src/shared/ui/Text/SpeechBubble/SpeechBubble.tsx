import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '../MDText';
import {
  SpeechBubbleBaseStyles,
  SpeechBubbleVariant,
  getSpeechBubbleColorTokens,
  getSpeechBubbleVariantConfig,
} from './SpeechBubbleStyles';

interface Props {
  style?: StyleProp<ViewStyle>;
  variant?: SpeechBubbleVariant;
  text: string;
  align?: TextStyle['textAlign'];
}

export const SpeechBubble = ({ style, text, align, variant = 'default' }: Props) => {
  const colors = useThemeColor();
  const variantConfig = getSpeechBubbleVariantConfig(variant);
  const colorTokens = getSpeechBubbleColorTokens(colors);

  return (
    <View style={style}>
      <View
        style={[
          SpeechBubbleBaseStyles.content,
          variantConfig.content,
          {
            backgroundColor: colorTokens.backgroundColor,
            borderColor: colorTokens.borderColor,
          },
        ]}>
        <MDText
          type={variantConfig.textType}
          color={colorTokens.textColor}
          align={align}
          numberOfLines={1}>
          {text}
        </MDText>
      </View>
      <View style={SpeechBubbleBaseStyles.triangleContent}>
        <View
          style={[
            SpeechBubbleBaseStyles.triangleBorder,
            variantConfig.triangleBorder,
            { borderBottomColor: colorTokens.borderColor },
          ]}></View>
        <View
          style={[
            SpeechBubbleBaseStyles.triangle,
            variantConfig.triangle,
            { borderBottomColor: colorTokens.backgroundColor },
          ]}></View>
      </View>
    </View>
  );
};

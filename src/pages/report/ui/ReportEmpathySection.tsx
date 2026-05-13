import { Image } from 'expo-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ImgSunCongrats2 } from '@assets/images';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  sentences?: string[];
}

export function ReportEmpathySection({ style, sentences }: Props) {
  const colors = useThemeColor();

  if (!sentences || sentences.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContent}>
        <Image style={styles.image} source={ImgSunCongrats2} contentFit="contain" />
      </View>

      <View style={styles.listContent}>
        {sentences.map((sentence, index) => (
          <View key={`${sentence}-${index}`} style={styles.sentenceBubble}>
            <MDText type="brandRegular" color={colors.text.brand} align="center">
              {sentence}
            </MDText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  imageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: 180,
    height: 160,
  },
  listContent: {
    gap: 16,
  },
  sentenceBubble: {
    minHeight: 45,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#F7DEC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

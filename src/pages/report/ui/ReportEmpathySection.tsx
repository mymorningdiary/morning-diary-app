import { useEffect, useMemo, useRef } from 'react';
import { Image } from 'expo-image';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ImgSunCongrats2 } from '@assets/images';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

const SENTENCE_ANIMATION_DURATION = 680;
const SENTENCE_ANIMATION_DELAY = 600;
const SENTENCE_INITIAL_TRANSLATE_X = -14;

interface Props {
  style?: StyleProp<ViewStyle>;
  sentences?: string[];
  isVisible?: boolean;
}

export function ReportEmpathySection({ style, sentences, isVisible = false }: Props) {
  const colors = useThemeColor();
  const sentenceAnimations = useMemo(
    () => Array.from({ length: sentences?.length ?? 0 }, () => new Animated.Value(0)),
    [sentences],
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = false;
    sentenceAnimations.forEach((animation) => animation.setValue(0));
  }, [sentenceAnimations]);

  useEffect(() => {
    if (!isVisible || hasAnimatedRef.current || sentenceAnimations.length === 0) {
      return;
    }

    hasAnimatedRef.current = true;

    const animation = Animated.stagger(
      SENTENCE_ANIMATION_DELAY,
      sentenceAnimations.map((sentenceAnimation) =>
        Animated.timing(sentenceAnimation, {
          toValue: 1,
          duration: SENTENCE_ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isVisible, sentenceAnimations]);

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
          <Animated.View
            key={`${sentence}-${index}`}
            style={[
              styles.sentenceBubble,
              {
                opacity: sentenceAnimations[index],
                transform: [
                  {
                    translateX: sentenceAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [SENTENCE_INITIAL_TRANSLATE_X, 0],
                    }),
                  },
                ],
              },
            ]}>
            <MDText type="brandRegular" color={colors.text.brand} align="center">
              {sentence}
            </MDText>
          </Animated.View>
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

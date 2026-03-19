import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { scheduleOnRN } from 'react-native-worklets';
import { DiaryAssistantContent } from './DiaryAssistantContent';
import { ImgSunBasic } from '@assets/images';
import { AssistantState } from '@features/diary/model/types';

const ASSISTANT_SHOW_DURATION_MS = 700;
const ASSISTANT_HIDE_DURATION_MS = 1_000;
const ASSISTANT_SHOW_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const ASSISTANT_HIDE_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

interface Props extends AssistantState {
  onHide: () => void;
}

export function DiaryAssistant({
  show = false,
  image = ImgSunBasic,
  message,
  version = 0,
  onHide,
}: Props) {
  const styles = AssistantStyles;

  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const { height } = useWindowDimensions();
  const hiddenTranslateY = -height;
  const closeThreshold = -height * 0.1;

  const translateY = useSharedValue(hiddenTranslateY);
  const gestureStartY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(event.translationY + gestureStartY.value, hiddenTranslateY);
    })
    .onEnd(() => {
      if (translateY.value < closeThreshold) {
        translateY.value = withSpring(hiddenTranslateY, { damping: 100 });
        scheduleOnRN(onHide);
        return;
      }

      translateY.value = withSpring(0, { damping: 100 });
    });

  useEffect(() => {
    if (show) {
      translateY.value = withTiming(0, {
        duration: ASSISTANT_SHOW_DURATION_MS,
        easing: ASSISTANT_SHOW_EASING,
      });
      return;
    }

    translateY.value = withTiming(hiddenTranslateY, {
      duration: ASSISTANT_HIDE_DURATION_MS,
      easing: ASSISTANT_HIDE_EASING,
    });
  }, [hiddenTranslateY, translateY, show]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  useEffect(() => {
    if (!show) {
      clearHideTimer();
      return;
    }

    clearHideTimer();
    hideTimer.current = setTimeout(() => {
      onHide();
      hideTimer.current = null;
    }, 2000);

    return clearHideTimer;
  }, [show, version, onHide]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, { minHeight: height }, animatedStyle]}>
        <Pressable style={styles.backdropContent} onPress={onHide}>
          <DiaryAssistantContent image={image} message={message} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const AssistantStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropContent: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
});

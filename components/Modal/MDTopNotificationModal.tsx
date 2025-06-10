import { GestureDetector, Gesture, Pressable } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { MDColors } from '@/types';
import { useThemeColor } from '@/hooks';
import { useEffect, useMemo } from 'react';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = SCREEN_HEIGHT; // 화면 높이의 30%만큼 내려옴

type MDTopNotificationModalProps = {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
};

const MDTopNotificationModal = ({ isVisible, onClose, children }: MDTopNotificationModalProps) => {
  const colors = useThemeColor();
  const styles = useMemo(() => ModalStyles({ colors }), [colors]);

  const translateY = useSharedValue(-SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value < -SCREEN_HEIGHT * 0.1) {
        translateY.value = withSpring(-SCREEN_HEIGHT, { damping: 50 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 50 });
      }
    });

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 50 });
    } else {
      translateY.value = withTiming(-SCREEN_HEIGHT, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isVisible, translateY]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, rStyle]}>
        <Pressable style={styles.containerContent} onPress={onClose}>
          {children}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const ModalStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      minHeight: SCREEN_HEIGHT,
    },
    containerContent: {
      flex: 1,
      paddingTop: 48,
      paddingHorizontal: 16,
      backgroundColor: 'red',
    },
  });

export default MDTopNotificationModal;

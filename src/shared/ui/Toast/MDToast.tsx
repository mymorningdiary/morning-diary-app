import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore } from '@shared/lib/toast/store';
import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

const AUTO_HIDE_MS = 2000;
const ANIMATION_MS = 200;
const TOAST_OFFSET = 16;

interface ToastStyleTokens {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export function MDToast() {
  const { type, visible, message, hide } = useToastStore();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const [isRendered, setIsRendered] = useState(visible);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  const tokens: ToastStyleTokens = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.primary.normal,
          textColor: colors.text.inversion,
          accentColor: colors.primary.light,
        };
      case 'error':
        return {
          backgroundColor: 'black',
          textColor: colors.text.inversion,
          accentColor: 'red',
        };
      case 'info':
      default:
        return {
          backgroundColor: 'black',
          textColor: colors.text.inversion,
          accentColor: 'lightblue',
        };
    }
  }, [colors, type]);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
      ]).start();

      const timerId = setTimeout(hide, AUTO_HIDE_MS);
      return () => clearTimeout(timerId);
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 12,
        duration: ANIMATION_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsRendered(false);
      }
    });
  }, [hide, opacity, translateY, visible]);

  if (!isRendered) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: TOAST_OFFSET + insets.bottom,
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      <Pressable onPress={hide} style={[styles.toast, { backgroundColor: tokens.backgroundColor }]}>
        <View style={[styles.accent, { backgroundColor: tokens.accentColor }]} />
        <MDText type="labelRegular" color={tokens.textColor} style={styles.message}>
          {message}
        </MDText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accent: {
    width: 4,
    height: '100%',
    borderRadius: 2,
  },
  message: {
    flex: 1,
  },
});

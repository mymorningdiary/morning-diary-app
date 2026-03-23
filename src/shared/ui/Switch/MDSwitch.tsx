import { useCallback, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function MDSwitch({ checked, onChange }: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => SwitchStyles({ colors, checked }), [colors, checked]);

  const translateX = useRef(new Animated.Value(checked ? 16 : 0)).current;
  const prevCheckedRef = useRef(checked);

  if (prevCheckedRef.current !== checked) {
    prevCheckedRef.current = checked;
    Animated.timing(translateX, {
      toValue: checked ? 18 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }

  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <Pressable style={styles.container} onPress={handleChange}>
      <Animated.View style={{ ...styles.thumb, transform: [{ translateX }] }} />
    </Pressable>
  );
}

const SwitchStyles = ({ colors, checked }: { colors: MDColorsType; checked: boolean }) =>
  StyleSheet.create({
    container: {
      width: 50,
      height: 32,
      borderRadius: 16,
      padding: 2,
      justifyContent: 'center',
      backgroundColor: checked ? colors.primary.normal : colors.fill.alternative,
    },
    thumb: {
      width: 28,
      height: 28,
      borderRadius: 100,
      backgroundColor: colors.fill.normal,
    },
  });

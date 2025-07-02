import { useThemeColor } from '@/hooks';
import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import MDPressable from './MDPressable';
import { MDColors } from '@/types';

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function MDSwitch({ checked, onChange }: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => SwitchStyles({ colors, checked }), [colors, checked]);

  // useState 대신 useRef 사용하여 리렌더링 방지
  const translateX = useRef(new Animated.Value(checked ? 16 : 0)).current;

  // 이전 checked 값 기억
  const prevCheckedRef = useRef(checked);

  // checked 값이 변경된 경우에만 애니메이션 실행
  if (prevCheckedRef.current !== checked) {
    prevCheckedRef.current = checked;
    Animated.timing(translateX, {
      toValue: checked ? 18 : 0,
      duration: 150, // 애니메이션 시간 단축
      useNativeDriver: true,
    }).start();
  }

  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <MDPressable style={styles.container} onPress={handleChange}>
      <Animated.View style={{ ...styles.thumb, transform: [{ translateX }] }} />
    </MDPressable>
  );
}

const SwitchStyles = ({ colors, checked }: { colors: MDColors; checked: boolean }) =>
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

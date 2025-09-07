import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type MDPressableProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
};

export default function MDPressable({
  children,
  style,
  pressedOpacity = 0.2,
  disabled,
  ...props
}: MDPressableProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [style, { opacity: pressed && !disabled ? pressedOpacity : 1 }]}>
      {children}
    </Pressable>
  );
}

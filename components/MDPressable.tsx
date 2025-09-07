import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type MDPressableProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
};

export default function MDPressable({
  children,
  style,
  pressedOpacity = 0.2,
  onPress,
  ...props
}: MDPressableProps) {
  return (
    <Pressable
      style={({ pressed }) => [style, { opacity: pressed && onPress ? pressedOpacity : 1 }]}
      onPress={onPress}
      {...props}>
      {children}
    </Pressable>
  );
}

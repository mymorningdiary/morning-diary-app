import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type MDPressableProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
};

export default function MDPressable({
  children,
  style,
  pressedOpacity = 0.2,
  ...props
}: MDPressableProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [style, { opacity: pressed ? 0.2 : 1 }]}>
      {children}
    </Pressable>
  );
}

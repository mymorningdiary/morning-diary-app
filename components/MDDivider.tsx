import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

export type MDDividerProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  vertical?: boolean;
  color?: string;
  thickness?: number;
  marginVertical?: number;
  marginHorizontal?: number;
};

export function MDDivider({
  style,
  vertical = false,
  color,
  thickness = 1,
  marginVertical = 0,
  marginHorizontal = 0,
  ...rest
}: MDDividerProps) {
  const colors = useThemeColor();
  const styles = dividerStyles({ colors });

  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        {
          backgroundColor: color || colors.line.normal,
          ...(vertical
            ? {
                width: thickness,
                marginHorizontal,
              }
            : {
                height: thickness,
                marginVertical,
                marginHorizontal,
              }),
        },
        style,
      ]}
      {...rest}
    />
  );
}

const dividerStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    horizontal: {
      alignSelf: 'stretch',
    },
    vertical: {
      alignSelf: 'stretch',
    },
  });

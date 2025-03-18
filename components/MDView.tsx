import { View, type ViewProps } from 'react-native';

type MDViewProps = ViewProps & {
  direction?: 'row' | 'column';
};

export function MDView({ style, direction = 'column', ...rest }: MDViewProps) {
  return (
    <View style={[{ backgroundColor: 'transparent', flexDirection: direction }, style]} {...rest} />
  );
}

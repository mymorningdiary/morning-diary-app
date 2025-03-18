import { View, type ViewProps } from 'react-native';

type MDRowProps = ViewProps;

export function MDRow({ style, ...rest }: MDRowProps) {
  return (
    <View style={[{ backgroundColor: 'transparent', flexDirection: 'row' }, style]} {...rest} />
  );
}

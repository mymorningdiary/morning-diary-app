import { View, type ViewProps } from 'react-native';

type MDColProps = ViewProps;

export function MDCol({ style, ...rest }: MDColProps) {
  return (
    <View style={[{ backgroundColor: 'transparent', flexDirection: 'column' }, style]} {...rest} />
  );
}

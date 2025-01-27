import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type MDViewProps = ViewProps & {
  direction?: 'row' | 'column';
};

export function MDView({ style, direction = 'column', ...rest }: MDViewProps) {
  const { background } = useThemeColor();

  return (
    <View
      style={[{ backgroundColor: background.normal, flexDirection: direction }, style]}
      {...rest}
    />
  );
}

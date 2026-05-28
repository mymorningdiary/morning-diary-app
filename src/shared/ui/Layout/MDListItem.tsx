import { Pressable, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  label: string;
  disabled?: boolean;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

export function MDListItem({ label, disabled = false, rightContent, onPress }: Props) {
  const colors = useThemeColor();
  const styles = ListItemStyles;
  const shouldDelegateRightContentPress = !!onPress && !disabled;

  return (
    <Pressable style={styles.container} onPress={onPress} disabled={disabled}>
      <MDText type="bodyRegular" color={disabled ? colors.text.alternative : colors.text.normal}>
        {label}
      </MDText>
      {rightContent ? (
        <View pointerEvents={shouldDelegateRightContentPress ? 'none' : 'auto'}>
          {rightContent}
        </View>
      ) : null}
    </Pressable>
  );
}

const ListItemStyles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

import { Pressable, StyleSheet } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface SettingsSectionListItemProps {
  label: string;
  disabled?: boolean;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

export function SettingsSectionListItem({
  label,
  disabled = false,
  rightContent,
  onPress,
}: SettingsSectionListItemProps) {
  const colors = useThemeColor();
  const styles = ItemStyles;

  return (
    <Pressable style={styles.container} onPress={onPress} disabled={disabled}>
      <MDText type="bodyRegular" color={disabled ? colors.text.alternative : colors.text.normal}>
        {label}
      </MDText>
      {rightContent}
    </Pressable>
  );
}

const ItemStyles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

import { Pressable, StyleSheet } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  id: number;
  title: string;
  option: string;
  isSelected?: boolean;
  onPress?: (id: number) => void;
}

export function TextGoalListItem({ id, title, option, isSelected = false, onPress }: Props) {
  const colors = useThemeColor();
  const styles = ListItemStyles({ colors });

  return (
    <Pressable
      style={[styles.container, isSelected && { borderColor: colors.primary.normal }]}
      onPress={() => onPress?.(id)}>
      <MDText type="labelRegular" color={colors.text.normal}>
        {title}
      </MDText>

      <MDText type="labelRegular" color={colors.text.alternative}>
        {option}
      </MDText>
    </Pressable>
  );
}

const ListItemStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.line.alternative,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

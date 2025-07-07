import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { StyleSheet } from 'react-native';

import { MDPressable, MDText } from '@/components';

interface Props {
  id: number;
  textLeft: string;
  textRight: string;
  isSelected: boolean;
  onPress: (id: number) => void;
}

const TextGoalListItem = ({ id, textLeft, textRight, isSelected, onPress }: Props) => {
  const colors = useThemeColor();
  const styles = ItemStyles({ colors, isSelected });

  const handlePress = () => {
    onPress(id);
  };

  return (
    <MDPressable style={styles.container} pressedOpacity={0.6} onPress={handlePress}>
      <MDText type="labelRegular" color={colors.text.normal}>
        {textLeft}
      </MDText>

      <MDText type="labelRegular" color={colors.text.alternative}>
        {textRight}
      </MDText>
    </MDPressable>
  );
};

const ItemStyles = ({ colors, isSelected }: { colors: MDColors; isSelected: boolean }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isSelected ? colors.primary.normal : colors.line.alternative,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default TextGoalListItem;

import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MDText } from '../MDText';
import { Image } from 'expo-image';
import { MDView } from '../MDView';

type GoalPageListItemProps = {
  goal: number;
  isSelected: boolean;
  onContainerPress: () => void;
};

const GoalPageListItem = ({ goal, isSelected, onContainerPress }: GoalPageListItemProps) => {
  const colors = useThemeColor();
  const styles = listItemStyles({ colors, isSelected });

  const renderIcon = () =>
    isSelected ? (
      <Image
        source={require('@/assets/images/ic-check_circle.png')}
        tintColor={colors.primary.normal}
        style={styles.icon}
      />
    ) : (
      <MDView style={styles.iconPlaceholder} />
    );

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={onContainerPress}>
      <MDText type="labelRegular">{`${goal}페이지`}</MDText>
      {renderIcon()}
    </TouchableOpacity>
  );
};

export default GoalPageListItem;

const listItemStyles = ({ colors, isSelected }: { colors: MDColors; isSelected: boolean }) =>
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
    icon: {
      width: 24,
      height: 24,
    },
    iconPlaceholder: {
      width: 24,
      height: 24,
      backgroundColor: colors.fill.alternative,
      borderRadius: 100,
    },
  });

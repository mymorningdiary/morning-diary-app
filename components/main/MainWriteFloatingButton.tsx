import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

type WriteFloatingButtonProps = {
  disabled?: boolean;
  onPress: () => void;
};

export default function WriteFloatingButton({ disabled, onPress }: WriteFloatingButtonProps) {
  const colors = useThemeColor();
  const styles = buttonStyles({ colors, disabled });

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity style={styles.container} disabled={disabled} onPress={handlePress}>
      <Image
        source={require('@/assets/images/ic-pen.png')}
        style={styles.icon}
        tintColor={disabled ? colors.icon.alternative : colors.icon.inversion}
      />
    </TouchableOpacity>
  );
}

const buttonStyles = ({ colors, disabled }: { colors: MDColors; disabled?: boolean }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 80,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 100,
      backgroundColor: disabled ? colors.fill.alternative : colors.primary.normal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WriteFloatingButtonProps = {
  disabled?: boolean;
  onPress: () => void;
};

export default function WriteFloatingButton({ disabled, onPress }: WriteFloatingButtonProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ButtonStyles({ colors, disabled, bottomInset: insets.bottom });

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

const ButtonStyles = ({ colors, disabled, bottomInset }: { colors: MDColors; disabled?: boolean, bottomInset: number }) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 80 - bottomInset,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 100,
      backgroundColor: disabled ? colors.fill.alternative : colors.primary.normal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: { width: 24, height: 24 },
  });

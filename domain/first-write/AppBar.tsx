import { MDRow } from '@/components';
import MDPressable from '@/components/MDPressable';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

type AppBarProps = {
  onCloseButtonPress: () => void;
};

export default function AppBar({ onCloseButtonPress }: AppBarProps) {
  const colors = useThemeColor();
  const styles = AppBarStyles({ colors });

  return (
    <MDRow style={styles.container}>
      <MDPressable style={styles.buttonClose} onPress={onCloseButtonPress}>
        <Image source={require('@/assets/images/ic-close.png')} style={styles.icon} />
      </MDPressable>
    </MDRow>
  );
}

const AppBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      alignItems: 'center',
      backgroundColor: colors.background.normal,
    },
    buttonClose: {
      height: '100%',
      paddingStart: 16,
      justifyContent: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

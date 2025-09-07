import { MDPressable, MDRow } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function AppBar() {
  const colors = useThemeColor();
  const styles = AppBarStyles({ colors });

  const onNavigateToBack = () => {
    router.back();
  };

  return (
    <MDRow style={styles.container}>
      <MDPressable style={styles.buttonClose} onPress={onNavigateToBack}>
        <Image style={styles.iconClose} source={require('@/assets/images/ic-close.png')} />
      </MDPressable>
    </MDRow>
  );
}

const AppBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
    },
    buttonClose: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconClose: {
      width: 24,
      height: 24,
    },
  });

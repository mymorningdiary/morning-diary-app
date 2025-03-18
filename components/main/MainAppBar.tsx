import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image, StyleSheet } from 'react-native';
import { MDRow } from '../MDRow';

export default function MainAppBar() {
  const colors = useThemeColor();
  const styles = appBarStyles({ colors });

  return (
    <MDRow style={styles.container}>
      <Image source={require('@/assets/images/ic-list.png')} style={styles.icon} />
      <Image source={require('@/assets/images/ic-setting.png')} style={styles.icon} />
    </MDRow>
  );
}

const appBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.normal,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

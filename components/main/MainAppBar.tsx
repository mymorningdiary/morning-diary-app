import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image, StyleSheet } from 'react-native';
import { MDRow } from '../MDRow';
import MDPressable from '../MDPressable';

interface MainAppBarProps {
  navigateToSetting?: () => void;
}

export default function MainAppBar({ navigateToSetting }: MainAppBarProps) {
  const colors = useThemeColor();
  const styles = appBarStyles({ colors });

  return (
    <MDRow style={styles.container}>
      {/* <MDPressable style={styles.containerButton} onPress={() => {}}>
        <Image source={require('@/assets/images/ic-list.png')} style={styles.icon} />
      </MDPressable> */}

      <MDPressable style={styles.containerButton} onPress={navigateToSetting}>
        <Image source={require('@/assets/images/ic-setting.png')} style={styles.icon} />
      </MDPressable>
    </MDRow>
  );
}

const appBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: colors.background.normal,
    },
    containerButton: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

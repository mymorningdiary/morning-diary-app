import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image, StyleSheet } from 'react-native';
import MDPressable from '../MDPressable';
import { MDRow } from '../MDRow';

interface Props {
  onNavigateBack: () => void;
}

export default function DiaryListAppBar({ onNavigateBack }: Props) {
  const colors = useThemeColor();
  const styles = appBarStyles({ colors });

  return (
    <MDRow style={styles.container}>
      <MDPressable style={styles.buttonBack} onPress={onNavigateBack}>
        <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.icon} />
      </MDPressable>
    </MDRow>
  );
}

const appBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.normal,
    },
    buttonBack: {
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

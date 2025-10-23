import { MDPressable, MDRow } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image, StyleSheet } from 'react-native';

interface Props {
  onNavigateBack: () => void;
}

export default function SignUpAppBar({ onNavigateBack }: Props) {
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
      width: '100%',
      height: 48,
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

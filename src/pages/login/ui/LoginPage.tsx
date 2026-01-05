import ImageSunBasic from '@assets/images/img-sun_basic.svg';
import { MDColors, useThemeColor } from '@shared/lib/theme';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  return (
    <SafeAreaView style={styles.container}>
      <ImageSunBasic />
    </SafeAreaView>
  );
}

const PageStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

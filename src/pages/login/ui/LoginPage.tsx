import { MDColors, useThemeColor } from '@shared/lib/theme';
import { StyleSheet, View } from 'react-native';

export function LoginPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  return <View style={styles.container}></View>;
}

const PageStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

import { StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

export function LoginEmailForm() {
  const colors = useThemeColor();
  const styles = FormStyles({ colors });

  return <View style={styles.container}></View>;
}

const FormStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {},
  });

import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

export function ResetPasswordCompletePage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDText>ResetPasswordComplete Page</MDText>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

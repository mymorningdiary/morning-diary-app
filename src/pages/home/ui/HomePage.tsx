import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

export function HomePage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDText>Home Page</MDText>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

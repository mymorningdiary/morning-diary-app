import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/MDPage';

import { MDText } from '@shared/ui/MDText';
import { useUser } from '@entities/user';

export function MainPage() {
  const styles = PageStyles;

  const { user } = useUser();

  return (
    <MDPage style={styles.container}>
      <MDText>Main Page, user: ${JSON.stringify(user)}</MDText>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

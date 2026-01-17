import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';

import { MDText } from '@shared/ui/Text';
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

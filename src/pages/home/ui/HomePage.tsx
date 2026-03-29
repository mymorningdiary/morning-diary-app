import { StyleSheet } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { WriteDiaryButton } from '@features/diary';
import { router } from 'expo-router';
import dayjs from 'dayjs';

export function HomePage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDText>Home Page</MDText>
      <WriteDiaryButton
        onPress={() => {
          router.push({
            pathname: '/diary-write',
            params: {
              date: dayjs().format('YYYY-MM-DD'),
            },
          });
        }}
      />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});

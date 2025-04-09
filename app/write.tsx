import { MDView } from '@/components';
import { WriteAppBar } from '@/components/write';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Write() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  return (
    <MDView style={styles.container}>
      <WriteAppBar
        date="2025-04-09"
        isCompleteButtonEnabled={false}
        onCompleteButtonPress={() => {}}
        onBackButtonPress={() => router.back()}
      />
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
  });

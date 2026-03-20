import { StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { DotIndicator } from '@shared/ui/Pagination/DotIndicator';
import { useState } from 'react';

export function FirstDiaryPage() {
  const styles = PageStyles;

  const slides = [{}, {}];
  const [currentPosition, setCurrentPosition] = useState(0);

  return (
    <MDPage style={styles.container}>
      <MDAppBar onBack={() => router.back()} />
      <DotIndicator style={styles.dotIndicator} position={currentPosition} count={slides.length} />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  dotIndicator: {
    marginTop: 40,
  },
});

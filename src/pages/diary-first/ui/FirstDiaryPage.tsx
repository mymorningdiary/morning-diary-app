import { StyleSheet, View } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { DotIndicator } from '@shared/ui/Pagination/DotIndicator';
import { useRef, useState } from 'react';
import { FirstDiarySlide1 } from './FirstDiarySlide1';
import PagerView from 'react-native-pager-view';
import { MDButton } from '@shared/ui/Button';

export function FirstDiaryPage() {
  const styles = PageStyles;
  const sliderRef = useRef<PagerView>(null);

  const slides = [
    { key: 'slide1', buttonLabel: '나만의 일기 스타일 고르기', component: <FirstDiarySlide1 /> },
  ];
  const [currentPosition, setCurrentPosition] = useState(0);

  return (
    <MDPage style={styles.container}>
      <MDAppBar onBack={() => router.back()} />
      <DotIndicator style={styles.dotIndicator} position={currentPosition} count={slides.length} />

      <PagerView
        ref={sliderRef}
        style={{ flex: 1 }}
        onPageSelected={({ nativeEvent }) => setCurrentPosition(nativeEvent.position)}>
        {slides.map((slide) => (
          <View key={slide.key} style={{ flex: 1 }}>
            {slide.component}
          </View>
        ))}
      </PagerView>

      <MDButton
        style={{ marginHorizontal: 16 }}
        label={slides[currentPosition].buttonLabel}
        onPress={() => {
          if (currentPosition < slides.length - 1) {
            sliderRef.current?.setPage(currentPosition + 1);
          }
        }}
      />
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

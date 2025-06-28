import { MDButton, MDText } from '@/components';
import MDDotIndicator from '@/components/MDDotIndicator';
import AppBar from '@/domain/first-write/AppBar';
import Page1 from '@/domain/first-write/Page1';
import Page2 from '@/domain/first-write/Page2';
import Page3 from '@/domain/first-write/Page3';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const PAGE_COUNT = 3;
const BUTTON_TEXTS = ['나만의 일기 스타일 고르기', '다음', '완료'];

export default function FirstWrite() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const pagerRef = useRef<PagerView>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isDisabledNextButton, setIsDisabledNextButton] = useState(false);

  const onCloseButtonPress = () => {
    router.replace('/main');
  };

  const onPageSelected = (position: number) => {
    setCurrentPage(position);
  };

  const onNextButtonPress = () => {
    if (currentPage === PAGE_COUNT - 1) {
      router.replace('/main');
    } else {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar onCloseButtonPress={onCloseButtonPress} />

      <View style={styles.containerDotIndicator}>
        <MDDotIndicator count={PAGE_COUNT} currentIndex={currentPage} />
      </View>

      <PagerView
        style={styles.containerPager}
        ref={pagerRef}
        initialPage={0}
        onPageSelected={({ nativeEvent }) => onPageSelected(nativeEvent.position)}>
        <Page1 key="1" />
        <Page2 key="2" writtenTextLength={210022200} targetTextLength={500} />
        <Page3 key="3" />
      </PagerView>

      <View style={styles.containerNextButton}>
        <MDButton
          title={BUTTON_TEXTS[currentPage]}
          disabled={isDisabledNextButton}
          onPress={onNextButtonPress}
        />
      </View>
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerDotIndicator: {
      alignItems: 'center',
      paddingTop: 40,
    },
    containerNextButton: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    containerPager: {
      flex: 1,
    },
  });

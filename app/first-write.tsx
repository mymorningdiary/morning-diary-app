import { MDButton } from '@/components';
import MDDotIndicator from '@/components/MDDotIndicator';
import AppBar from '@/domain/first-write/AppBar';
import Page1 from '@/domain/first-write/Page1';
import Page2 from '@/domain/first-write/Page2';
import Page3 from '@/domain/first-write/Page3';
import { useThemeColor } from '@/hooks';
import useGetTextGoals from '@/hooks/useTextGoalQuery';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const PAGE_COUNT = 3;
const BUTTON_TEXTS = ['나만의 일기 스타일 고르기', '다음', '완료'];

export default function FirstWrite() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { textLength } = useLocalSearchParams();

  const pagerRef = useRef<PagerView>(null);

  const { textGoals } = useGetTextGoals();

  const [currentPage, setCurrentPage] = useState(0);
  const [currentTextGoalId, setCurrentTextGoalId] = useState<number | null>(null);
  const [writtenTextLength, setWrittenTextLength] = useState<number | null>(null);
  const [targetTextLength, setTargetTextLength] = useState<number | null>(null);

  const isDisabledNextButton = useMemo(() => {
    if (currentPage === 1 && currentTextGoalId === null) return true;
    return false;
  }, [currentPage, currentTextGoalId]);

  const isScrollEnabled = useMemo(() => {
    if (currentPage === 1 && currentTextGoalId === null) return false;
    return true;
  }, [currentPage, currentTextGoalId]);

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

  useEffect(() => {
    if (textLength === undefined || textLength === null) {
      router.replace('/main');
      return;
    }

    const parsedLength = Number(textLength);
    if (isNaN(parsedLength) || parsedLength < 0) {
      router.replace('/main');
      return;
    }

    setWrittenTextLength(parsedLength);
  }, [textLength]);

  useEffect(() => {
    if (textGoals === null) return;

    setTargetTextLength(textGoals[1].textLength);
  }, [textGoals]);

  if (writtenTextLength === null || targetTextLength === null) {
    return null;
  }

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
        scrollEnabled={isScrollEnabled}
        onPageSelected={({ nativeEvent }) => onPageSelected(nativeEvent.position)}>
        <Page1 key="1" />
        <Page2
          key="2"
          textGoals={textGoals}
          currentTextGoalId={currentTextGoalId}
          onSelectTextGoalItem={setCurrentTextGoalId}
          writtenTextLength={writtenTextLength}
          targetTextLength={targetTextLength}
        />
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

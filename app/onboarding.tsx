import { MDButton, MDView } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function Onboarding() {
  const pageRef = useRef<PagerView>(null);
  const colors = useThemeColor();
  const styles = screenStyles({ colors });
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);
  const bottomButtonTexts = useMemo(() => ['다음', '시작하기'], []);

  const handleBottomButtonPress = () => {
    if (currentPage === 1) {
      router.replace('/sign-in');
    } else {
      pageRef.current?.setPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSelected = (position: number) => {
    setCurrentPage(position);
  };

  return (
    <MDView style={styles.container}>
      <MDView style={styles.indicatorContainer}>
        {[0, 1].map((index) => (
          <MDView key={index} style={[styles.dot, currentPage === index && styles.activeDot]} />
        ))}
      </MDView>

      <PagerView
        style={styles.container}
        initialPage={0}
        ref={pageRef}
        onPageSelected={({ nativeEvent }) => handlePageSelected(nativeEvent.position)}>
        <MDView key="1" style={styles.page}>
          {/* <SpeechBubble text="의식의 흐름" /> */}
          <Image source={require('@/assets/images/img_onboarding_1.png')} />
        </MDView>
        <MDView key="2" style={styles.page}>
          <Image source={require('@/assets/images/img_onboarding_2.png')} />
        </MDView>
      </PagerView>

      <MDView style={styles.bottomContainer}>
        <MDButton title={bottomButtonTexts[currentPage]} onPress={handleBottomButtonPress} />
      </MDView>
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal
    },
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomContainer: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.fill.alternative,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary.normal,
    },
  });

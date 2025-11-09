import { MDButton, MDLargeSpeechBubble, MDText, MDView } from '@/components';
import { useAppState } from '@/contexts/AppStateContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = screenStyles({ colors, bottomInset: insets.bottom });

  const router = useRouter();
  const { markVisited } = useAppState();

  const pageRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const bottomButtonTexts = useMemo(() => ['다음', '시작하기'], []);

  const handleBottomButtonPress = () => {
    if (currentPage === 1) {
      // 온보딩 완료 시 방문 여부 저장 후 로그인 화면으로
      markVisited();
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
    <SafeAreaView style={styles.containerSafeArea}>
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
            <View style={styles.containerOnboarding1}>
              <View style={{ alignItems: 'center', gap: 5 }}>
                <MDLargeSpeechBubble style={{ width: 100 }} text="의식의 흐름" />
                <Image source={require('@/assets/images/img-onboarding_1.png')} />
              </View>

              <View>
                <MDText type="titleSemiBold" color={colors.text.brand} align="center">
                  {`'나'를 발견하는 `}
                  <MDText type="titleSemiBold" color={colors.primary.normal} align="center">
                    {`아무 말`}
                  </MDText>
                  {`이나 쓰는 아침 일기`}
                </MDText>
                <MDText type="labelRegular" color={colors.text.alternative} align="center">
                  {`기상 직후 45분 동안은 사람의 방어기제가\n활동하지 않는 유일한 시간이에요.\n\n아침일기를 쓰면 새로운 ‘나’를 발견할지도 몰라요.`}
                </MDText>
              </View>
            </View>
          </MDView>
          <MDView key="2" style={styles.page}>
            <View style={styles.containerOnboarding2}>
              <MDText type="titleSemiBold" color={colors.text.brand} align="center">
                {`아침일기를 통해\n`}
                <MDText type="titleSemiBold" color={colors.primary.normal} align="center">
                  {`'나'`}
                </MDText>
                {`를 더 알아보는 시간`}
              </MDText>
              <View style={{ gap: 16 }}>
                <Image source={require('@/assets/images/img-onboarding_2_1.png')} />
                <Image source={require('@/assets/images/img-onboarding_2_2.png')} />
                <Image source={require('@/assets/images/img-onboarding_2_3.png')} />
              </View>
            </View>
          </MDView>
        </PagerView>

        <MDView style={styles.bottomContainer}>
          <MDButton title={bottomButtonTexts[currentPage]} onPress={handleBottomButtonPress} />
        </MDView>
      </MDView>
    </SafeAreaView>
  );
}

const screenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomContainer: {
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
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
    containerOnboarding1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      gap: 40,
    },
    containerOnboarding2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      gap: 40,
    },
  });

import { MDButton, MDPressable, MDText, MDView } from '@/components';
import { useAppState } from '@/contexts/AppStateContext';
import { authAPI } from '@/core/api';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MDColors } from '@/types/types';
import { login } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = screenStyles({ colors, bottomInset: insets.bottom });

  const { setAuthToken } = useAppState();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: authAPI.postKakaoLogin,
  });

  const kakaoSignIn = async () => {
    if (isPending) return;

    try {
      const user = await login();
      const response = await mutateAsync({ accessToken: user.accessToken });

      if (response.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = response.data;
        console.log('[SignInScreen] data:', response.data);

        setAuthToken({ accessToken, refreshToken });
        if (isExistUser) {
          router.replace('/(app)');
        } else {
          router.replace('/(app)/alarm-permission');
        }
      }
    } catch (e) {
      console.error('Failed to sign in', e);
    }
  };

  const onNavigateToPrivacyTerms = () => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL: 'https://slashpage.com/morningdiary/xjqy1g2vwjn77m6vd54z' },
    });
  };

  const onNavigateToUseTerms = () => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL: 'https://slashpage.com/morningdiary/ywk9j72986j94mgpqvnd' },
    });
  };

  const navigateToSignInEmail = () => {
    router.push({
      pathname: '/sign-in-email',
    });
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDView style={styles.container}>
        <MDView style={styles.logoContainer}>
          <Image source={require('@/assets/images/img-logo.png')} />
          <MDText type="labelRegular" style={styles.logoText}>
            아침에 쓰는 내 마음 속 이야기
          </MDText>
        </MDView>

        <MDView style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <MDButton
              style={styles.emailSignInButton}
              textStyle={styles.emailSignInButtonText}
              title={'이메일로 계속하기'}
              icon={require('@/assets/images/ic-mail.png')}
              onPress={navigateToSignInEmail}
            />
            <MDButton
              style={styles.kakaoSignInButton}
              textStyle={styles.kakaoSignInButtonText}
              title={'카카오 로그인'}
              icon={require('@/assets/images/ic-kakao.png')}
              onPress={kakaoSignIn}
            />
          </View>

          <MDView style={styles.termsContainer}>
            <MDView direction="row">
              <MDText type="caption1Regular" style={styles.termsText}>
                {`계속하기를 진행하시면 `}
              </MDText>

              <MDPressable onPress={onNavigateToPrivacyTerms}>
                <MDText type="caption1Regular" style={styles.linkText}>
                  {`개인정보 처리방침`}
                </MDText>
              </MDPressable>

              <MDText type="caption1Regular" style={styles.termsText}>
                {` 및 `}
              </MDText>
            </MDView>

            <MDView direction="row">
              <MDPressable onPress={onNavigateToUseTerms}>
                <MDText type="caption1Regular" style={styles.linkText}>
                  {`이용약관`}
                </MDText>
              </MDPressable>

              <MDText type="caption1Regular" style={styles.termsText}>
                {`에 동의하게 됩니다.`}
              </MDText>
            </MDView>
          </MDView>

          <MDText type="caption2Regular" style={styles.copyrightText}>
            © 2025 Morning Diary
          </MDText>
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
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20 - bottomInset,
      backgroundColor: colors.background.normal,
    },
    logoContainer: {
      width: '100%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    logoText: {
      color: colors.text.alternative,
    },
    buttonContainer: {
      gap: 10,
    },
    emailSignInButton: {
      backgroundColor: colors.fill.normal,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    emailSignInButtonText: {
      color: colors.text.normal,
    },
    kakaoSignInButton: {
      backgroundColor: colors.kakao,
    },
    kakaoSignInButtonText: {
      color: colors.text.normal,
    },
    bottomContainer: {
      width: '100%',
      gap: 24,
    },
    termsContainer: {
      alignItems: 'center',
    },
    termsText: {
      flexDirection: 'row',
      color: colors.text.alternative,
    },
    linkText: {
      textDecorationLine: 'underline',
      color: colors.text.alternative,
    },
    copyrightText: {
      textAlign: 'center',
    },
  });

import { MDButton, MDText, MDView } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginWithKakao } from '@/hooks';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MDColors } from '@/types/types';
import { login as loginKakao } from '@react-native-kakao/user';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const { mutate: mutateLoginKakao, isPending: isLoginLoading, auth } = useLoginWithKakao();
  const { login } = useAuth();

  const handleLoginWithKakao = async () => {
    if (isLoginLoading) return;

    try {
      const user = await loginKakao();
      mutateLoginKakao({ accessToken: user.accessToken });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  useEffect(() => {
    if (auth === null) return;

    const { token, isExistUser } = auth;
    login(token);

    if (isExistUser) {
      router.replace('/main');
    } else {
      router.replace('/(notification)/permission');
    }
  }, [auth]);

  return (
    <MDView style={styles.container}>
      <MDView style={styles.logoContainer}>
        <Image source={require('@/assets/images/img-logo.png')} />
        <MDText type="labelRegular" style={styles.logoText}>
          아침에 쓰는 내 마음 속 이야기
        </MDText>
      </MDView>

      {/* <MDText>{keyHash}</MDText> */}

      <MDView style={styles.bottomContainer}>
        <MDButton
          style={styles.kakaoLoginButton}
          textStyle={styles.kakaoLoginButtonText}
          title={'카카오 로그인'}
          icon={require('@/assets/images/ic-kakao.png')}
          onPress={handleLoginWithKakao}
        />

        <MDView style={styles.termsContainer}>
          <MDView direction="row">
            <MDText type="caption1Regular" style={styles.termsText}>
              {`계속하기를 진행하시면 `}
            </MDText>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                console.log('개인정보 처리방침 화면으로 이동');
                // TODO: 개인정보 처리방침 화면으로 이동
              }}>
              <MDText type="caption1Regular" style={styles.linkText}>
                {`개인정보 처리방침`}
              </MDText>
            </TouchableOpacity>

            <MDText type="caption1Regular" style={styles.termsText}>
              {` 및 `}
            </MDText>
          </MDView>

          <MDView direction="row">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                console.log('이용약관 화면으로 이동');
                // TODO: 이용약관 화면으로 이동
              }}>
              <MDText type="caption1Regular" style={styles.linkText}>
                {`이용약관`}
              </MDText>
            </TouchableOpacity>

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
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
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
    kakaoLoginButton: {
      backgroundColor: colors.kakao,
    },
    kakaoLoginButtonText: {
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

import { MDButton } from '@/components';
import MDTextField from '@/components/MDTextField';
import { useAppState } from '@/contexts/AppStateContext';
import { authAPI } from '@/core/api';
import SignInAppBar from '@/domain/sign-in/components/SignInAppBar';
import { useThemeColor } from '@/hooks';

import { MDColors } from '@/types';
import { Logger } from '@/utils/logs';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_PASSWORD_LEN = 64;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^+=-])(?=.*[0-9]).{10,64}$/;

interface FormFieldState {
  value: string;
  helperText: string | null;
  isValid: boolean;
}

export default function SignInEmailScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: authAPI.postSignIn,
  });

  const { setAuthToken } = useAppState();

  const [email, setEmail] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });
  const [password, setPassword] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });

  const handleChangeEmail = (value: string) => {
    setEmail((prev) => ({ ...prev, value, helperText: null }));
  };

  const handleChangePassword = (value: string) => {
    setPassword((prev) => ({ ...prev, value, helperText: null }));
  };

  const validateEmail = () => {
    const isEmailValid = EMAIL_REGEX.test(email.value);
    const helperText = isEmailValid ? null : '이메일을 올바르게 입력해주세요';

    setEmail((prev) => ({
      ...prev,
      helperText,
      isValid: isEmailValid,
    }));

    return isEmailValid;
  };

  const validatePassword = () => {
    const isPasswordValid = PASSWORD_REGEX.test(password.value);
    const helperText = isPasswordValid
      ? null
      : '비밀번호를 입력해주세요 (영문자+숫자+특수문자 10-64자)';

    setPassword((prev) => ({
      ...prev,
      helperText,
      isValid: isPasswordValid,
    }));

    return isPasswordValid;
  };

  const handleSignIn = async () => {
    if (!validateEmail()) return;
    if (!validatePassword()) return;

    try {
      const res = await signIn({ email: email.value, password: password.value });
      if (res.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = res.data;

        setAuthToken({ accessToken, refreshToken });
        if (isExistUser) {
          router.replace('/(app)');
        } else {
          router.replace('/(app)/alarm-permission');
        }
      }
    } catch (error: any) {
      Logger('SignInEmailScreen').error('Failed to sign up', error);

      switch (error.code) {
        case 4000: {
          setEmail((prev) => ({
            ...prev,
            helperText: '존재하지 않는 사용자에요',
            isValid: false,
          }));
          break;
        }
        case 4007:
        case 4008: {
          setEmail((prev) => ({
            ...prev,
            helperText: '이메일을 올바르게 입력해주세요',
            isValid: false,
          }));
          break;
        }
        case 4009:
        case 4010: {
          setPassword((prev) => ({
            ...prev,
            helperText: '비밀번호를 입력해주세요 (영문자+숫자+특수문자 10-64자)',
            isValid: false,
          }));
          break;
        }
        case 4012: {
          setPassword((prev) => ({
            ...prev,
            helperText: '비밀번호가 일치하지 않아요',
            isValid: false,
          }));
          break;
        }
        case 4013: {
          setEmail((prev) => ({
            ...prev,
            helperText: 'SNS 연동 사용자에요',
            isValid: false,
          }));
          break;
        }
      }
    }
  };

  const navigateToSignUp = () => {
    router.push({
      pathname: '/sign-up',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SignInAppBar onNavigateBack={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled">
          <MDTextField
            ref={emailRef}
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            inputMode="email"
            {...email}
            onChangeText={handleChangeEmail}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="비밀번호"
            maxLength={MAX_PASSWORD_LEN}
            secureTextEntry
            returnKeyType="done"
            {...password}
            onChangeText={handleChangePassword}
            onSubmitEditing={handleSignIn}
          />
        </ScrollView>

        <View style={styles.footer}>
          <MDButton title={'로그인'} onPress={handleSignIn} />
          <MDButton
            style={styles.signUpButton}
            textStyle={styles.signUpButtonText}
            title={'회원가입'}
            onPress={navigateToSignUp}
          />
        </View>
      </KeyboardAvoidingView>
      {isSignInPending && (
        <View
          style={[StyleSheet.absoluteFillObject, styles.loading]}
          onStartShouldSetResponder={() => true}>
          <ActivityIndicator color={colors.primary.normal} size={'large'} />
        </View>
      )}
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    keyboardAvoider: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: bottomInset + 80, // 버튼 높이 + 여유
      gap: 24,
    },
    footer: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
      gap: 10,
    },
    loading: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    signUpButton: {
      backgroundColor: colors.fill.normal,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    signUpButtonText: {
      color: colors.text.normal,
    },
  });

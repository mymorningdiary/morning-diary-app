import { MDButton, MDText } from '@/components';
import MDTextField from '@/components/MDTextField';
import { ApiError, authAPI } from '@/core/api';
import mailAPI from '@/core/api/mail/apis';
import SignUpAppBar from '@/domain/sign-up/components/SignUpAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { msToMMSS } from '@/utils/dates';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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

const MAX_OTP_MS = 180_001;
const MAX_CODE_LEN = 6;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.[a-zA-Z])(?=.[!@#$%^+=-])(?=.[0-9]).{8,15}$/;

interface FormFieldState {
  value: string;
  helperText: string | null;
  isValid: boolean;
}

export default function SignUpScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const { mutateAsync: checkDuplicateEmail, isPending: isDuplicatePending } = useMutation({
    mutationFn: authAPI.postDuplicateEmail,
  });
  const { mutateAsync: requestOTP, isPending: isOTPPending } = useMutation({
    mutationFn: mailAPI.postAuthenticationNumber,
  });

  const [email, setEmail] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });

  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [remainingTime, setRemainingTime] = useState(MAX_OTP_MS);
  const [canSignUp, setCanSignUp] = useState(false);
  const [isEmailSuccess, setEmailSuccess] = useState(false);

  const isEmailPending = isDuplicatePending || isOTPPending;

  const handleChangeEmail = (value: string) => {
    const isValid = EMAIL_REGEX.test(value);
    if (!isValid && isEmailSuccess) {
      setRemainingTime(0);
      setEmailSuccess(false);
    }

    setEmail({ value, helperText: null, isValid });
  };

  const handleChangeOTP = (text: string) => {
    setOTP(text);
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
  };

  const handleChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
  };

  const handleRequestOTP = async () => {
    if (!email.isValid || isEmailPending) return;
    emailRef.current?.blur();

    try {
      const res = await checkDuplicateEmail({ email: email.value });

      if (res.code === 2000) {
        const resOTP = await requestOTP({ email: email.value, type: 'SIGN_UP' });

        if (resOTP.code === 2000) {
          setEmail((prev) => ({
            ...prev,
            helperText: '사용 가능한 이메일이에요',
            isValid: true,
          }));
          setEmailSuccess(true);
          otpRef.current?.focus();
        }
      }
    } catch (error: any) {
      console.error('Failed to request otp', error);

      switch (error.code) {
        case 4008: {
          setEmail((prev) => ({
            ...prev,
            helperText: '올바르지 않은 이메일 형식이에요',
            isValid: false,
          }));
          return;
        }
        case 4011: {
          setEmail((prev) => ({
            ...prev,
            helperText: '사용 중인 이메일이에요',
            isValid: false,
          }));
          return;
        }
      }
    }
  };

  const handleSignUp = () => {};

  useEffect(() => {
    if (isEmailSuccess) {
      otpRef?.current?.focus();
    }
  }, [isEmailSuccess]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SignUpAppBar onNavigateBack={() => router.back()} />
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
            label="이메일"
            placeholder="morning-diary@example.com"
            returnKeyType="done"
            keyboardType="email-address"
            inputMode="email"
            {...email}
            onChangeText={handleChangeEmail}
            onSubmitEditing={handleRequestOTP}
            suffix={
              <MDButton
                style={styles.otpButton}
                textType="labelRegular"
                title={isEmailSuccess ? '재요청' : '인증 요청'}
                disabled={!email.isValid}
                onPress={handleRequestOTP}
              />
            }
          />

          {isEmailSuccess && (
            <MDTextField
              ref={otpRef}
              label="인증 번호"
              placeholder="이메일을 확인해주세요"
              value={otp}
              returnKeyType="next"
              keyboardType="decimal-pad"
              inputMode="numeric"
              maxLength={MAX_CODE_LEN}
              onChangeText={handleChangeOTP}
              onSubmitEditing={() => passwordRef?.current?.focus()}
              suffix={
                <MDText type="labelRegular" color={colors.text.alternative}>
                  {msToMMSS(remainingTime)}
                </MDText>
              }
            />
          )}

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={password}
            secureTextEntry
            returnKeyType="next"
            onChangeText={handleChangePassword}
            onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onChangeText={handleChangeConfirmPassword}
          />
        </ScrollView>

        <View style={styles.footer}>
          <MDButton title={'가입하기'} disabled={!canSignUp} onPress={handleSignUp} />
        </View>
      </KeyboardAvoidingView>
      {isEmailPending && (
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
    textFieldRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 12,
    },
    otpButton: {
      height: 28,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    footer: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
    loading: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

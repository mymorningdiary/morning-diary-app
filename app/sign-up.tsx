import { MDButton, MDText } from '@/components';
import MDTextField from '@/components/MDTextField';
import { useAppState } from '@/contexts/AppStateContext';
import { ApiError, authAPI } from '@/core/api';
import mailAPI from '@/core/api/mail/apis';
import SignUpAppBar from '@/domain/sign-up/components/SignUpAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { msToMMSS } from '@/utils/dates';
import { Logger } from '@/utils/logs';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
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
const MAX_PASSWORD_LEN = 64;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const OTP_REGEX = /^\d{6}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^+=-])(?=.*[0-9]).{10,64}$/;

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

  const otpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutateAsync: checkDuplicateEmail, isPending: isDuplicatePending } = useMutation({
    mutationFn: authAPI.postDuplicateEmail,
  });
  const { mutateAsync: requestOTP, isPending: isOTPPending } = useMutation({
    mutationFn: mailAPI.postAuthenticationNumber,
  });
  const { mutateAsync: verifyOTP, isPending: isVerifyOTPPending } = useMutation({
    mutationFn: authAPI.postVerifyEmail,
  });
  const { mutateAsync: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: authAPI.postSignUp,
  });
  const { setAuthToken } = useAppState();

  const [email, setEmail] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });
  const [otp, setOTP] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });
  const [password, setPassword] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });
  const [confirmPassword, setConfirmPassword] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });

  const isEmailPending = isDuplicatePending || isOTPPending;
  const [isEmailSuccess, setEmailSuccess] = useState(false);

  const [otpTime, setOTPTime] = useState(MAX_OTP_MS);
  const [isOTPSuccess, setOTPSuccess] = useState(false);

  const canSignUp = useMemo(() => {
    return isEmailSuccess && isOTPSuccess && password.isValid && confirmPassword.isValid;
  }, [isEmailSuccess, isOTPSuccess, password.isValid, confirmPassword.isValid]);

  const handleChangeEmail = (value: string) => {
    const isValid = EMAIL_REGEX.test(value);
    if (!isValid && isEmailSuccess) {
      setEmailSuccess(false);
    }

    setEmail({ value, helperText: null, isValid });
  };

  const handleChangeOTP = (value: string) => {
    const isValid = OTP_REGEX.test(value);
    if (isEmailSuccess && isValid) {
      handleVerifyOTP(value);
    }
    setOTP({ value, helperText: null, isValid });
  };

  const validateConfirmPassword = (p1: string, p2: string) => {
    const isValid = p1 === p2;
    return { isValid, helperText: isValid ? '비밀번호가 일치해요' : '비밀번호가 일치하지 않아요' };
  };

  const handleChangePassword = (value: string) => {
    const isValid = PASSWORD_REGEX.test(value);
    const helperText = isValid ? '사용 가능한 비밀번호에요' : '사용 불가능한 비밀번호에요';

    if (confirmPassword.value.length > 0) {
      const validation = validateConfirmPassword(value, confirmPassword.value);
      setConfirmPassword((prev) => ({
        ...prev,
        helperText: validation.helperText,
        isValid: validation.isValid,
      }));
    }

    setPassword({ value, helperText, isValid });
  };

  const handleChangeConfirmPassword = (value: string) => {
    const { isValid, helperText } = validateConfirmPassword(password.value, value);

    setConfirmPassword({ value, helperText, isValid });
  };

  const handleRequestOTP = async () => {
    if (!email.isValid || isEmailPending) return;
    setEmailSuccess(false);
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
          startOTPTimer();
        }
      }
    } catch (error: any) {
      Logger('SignUpScreen').error('Failed to request otp', error);

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

  const clearOTPTimer = () => {
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
      otpTimerRef.current = null;
    }
  };

  const startOTPTimer = () => {
    clearOTPTimer();
    setOTPTime(MAX_OTP_MS);
    setOTP({ value: '', helperText: null, isValid: false });

    otpTimerRef.current = setInterval(() => {
      setOTPTime((prev) => {
        if (prev <= 1000) {
          clearOTPTimer();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const handleVerifyOTP = async (value: string) => {
    if (isVerifyOTPPending) return;

    try {
      const res = await verifyOTP({ email: email.value, authenticationNumber: value });
      if (res.code === 2000) {
        clearOTPTimer();
        setOTP((prev) => ({ ...prev, helperText: '인증되었어요', isValid: true }));
        setOTPSuccess(true);
        passwordRef.current?.focus();
      }
    } catch (error: any) {
      Logger('SignUpScreen').error('Failed to verify otp', error);

      switch (error.code) {
        case 4402:
        case 4403:
        case 4405:
        case 4406: {
          setOTP((prev) => ({
            ...prev,
            helperText: '인증번호가 잘못 입력되었어요',
            isValid: false,
          }));
          break;
        }
        case 4404: {
          clearOTPTimer();
          setOTPTime(0);
          setOTP((prev) => ({ ...prev, helperText: '인증시간이 만료되었어요', isValid: false }));
          break;
        }
      }
    }
  };

  const handleSignUp = async () => {
    if (isSignUpPending) return;

    try {
      const res = await signUp({ email: email.value, password: password.value });
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
      Logger('SignUpScreen').error('Failed to sign up', error);

      switch (error.code) {
        case 4009:
        case 4010: {
          setPassword((prev) => ({
            ...prev,
            helperText: '사용 불가능한 비밀번호에요',
            isValid: false,
          }));
          setConfirmPassword((prev) => ({
            ...prev,
            helperText: null,
            isValid: false,
          }));
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (otpTime <= 0) {
      setOTP((prev) => ({ ...prev, helperText: '인증시간이 만료되었어요', isValid: false }));
    }
  }, [otpTime]);

  useEffect(() => {
    if (!isEmailSuccess) return;

    const task = InteractionManager.runAfterInteractions(() => {
      otpRef.current?.focus();
    });

    return () => task.cancel();
  }, [isEmailSuccess]);

  useEffect(() => {
    return () => {
      clearOTPTimer();
    };
  }, []);

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
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="done"
            keyboardType="email-address"
            inputMode="email"
            editable={!(email.isValid && isEmailSuccess)}
            {...email}
            onChangeText={handleChangeEmail}
            onSubmitEditing={handleRequestOTP}
            suffix={
              <MDButton
                style={styles.otpButton}
                textType="labelRegular"
                title={isEmailSuccess ? (isOTPSuccess ? '인증완료' : '재요청') : '인증 요청'}
                disabled={!email.isValid || isOTPSuccess}
                onPress={handleRequestOTP}
              />
            }
          />

          {isEmailSuccess && (
            <MDTextField
              ref={otpRef}
              label="인증 번호"
              placeholder="이메일을 확인해주세요"
              returnKeyType="next"
              keyboardType="decimal-pad"
              inputMode="numeric"
              maxLength={MAX_CODE_LEN}
              editable={otpTime > 0 && !isOTPSuccess}
              {...otp}
              onChangeText={handleChangeOTP}
              onSubmitEditing={() => passwordRef?.current?.focus()}
              suffix={
                <MDText type="labelRegular" color={colors.text.alternative}>
                  {msToMMSS(otpTime)}
                </MDText>
              }
            />
          )}

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            maxLength={MAX_PASSWORD_LEN}
            secureTextEntry
            returnKeyType="next"
            {...password}
            onChangeText={handleChangePassword}
            onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            maxLength={MAX_PASSWORD_LEN}
            secureTextEntry
            returnKeyType="done"
            {...confirmPassword}
            onChangeText={handleChangeConfirmPassword}
          />
        </ScrollView>

        <View style={styles.footer}>
          <MDButton title={'가입하기'} disabled={!canSignUp} onPress={handleSignUp} />
        </View>
      </KeyboardAvoidingView>
      {(isEmailPending || isVerifyOTPPending || isSignUpPending) && (
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

import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useSignUp } from '@entities/auth';
import { EmailOtpForm } from '@features/auth';
import { KEYBOARD_SPACING, useKeyboardVisible } from '@shared/lib/keyboard';
import {
  confirmPassword,
  OTP_LEN,
  PASSWORD_MAX_LEN,
  validatePassword,
} from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  onSignUpSuccess?: (isExistUser: boolean) => void;
  onSignUpError?: (message: string) => void;
}

export function SignUpForm({ onSignUpSuccess, onSignUpError }: Props) {
  const styles = FormStyles;
  const keyboardVisible = useKeyboardVisible();

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const password1Ref = useRef<TextInput | null>(null);
  const password2Ref = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});
  const [password1, setPassword1] = useState<MDFieldState>({});
  const [password2, setPassword2] = useState<MDFieldState>({});

  const canSignUp =
    email.status === 'success' &&
    otp.status === 'success' &&
    password1.status === 'success' &&
    password2.status === 'success';

  // 회원가입 요청
  const { signUp, isPending: isSignUpPending } = useSignUp({
    onSuccess: (isExistUser: boolean) => {
      onSignUpSuccess?.(isExistUser);
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'email': {
          setEmail((prev) => ({ ...prev, status: 'error', message }));
          setTimeout(() => emailRef?.current?.focus(), 0);
          break;
        }
        case 'password': {
          setPassword1((prev) => ({ ...prev, status: 'error', message }));
          setPassword2((prev) => ({ ...prev, status: 'error', message }));
          setTimeout(() => password1Ref.current?.focus(), 0);
          break;
        }
        default: {
          onSignUpError?.(message);
          break;
        }
      }
    },
  });

  const validatePassword2 = (nextPassword1: string, nextPassword2: string) => {
    const { isSame, message } = confirmPassword(nextPassword1, nextPassword2);
    if (!isSame) {
      return { status: 'error', message } as const;
    }

    const { isValid } = validatePassword(nextPassword2);
    return {
      status: isValid ? 'success' : 'error',
      message: isValid ? message : '사용 불가능한 비밀번호에요 (영문자+숫자+특수문자 10-64자)',
    } as const;
  };

  const handlePassword1Change = (value: string) => {
    const password2Value = password2.value;
    if (password2Value && password2Value.length > 0) {
      setPassword2((prev) => ({
        ...prev,
        ...validatePassword2(value, password2Value),
      }));
    }

    if (value.length === 0) {
      setPassword1({ value, status: 'default', message: null });
      return;
    }

    const { isValid } = validatePassword(value);
    setPassword1({
      value,
      status: isValid ? 'success' : 'error',
      message: isValid
        ? '사용 가능한 비밀번호에요'
        : '사용 불가능한 비밀번호에요 (영문자+숫자+특수문자 10-64자)',
    });
  };

  const handlePassword2Change = (value: string) => {
    if (value.length === 0) {
      setPassword2({ value, status: 'default', message: null });
      return;
    }

    setPassword2({
      value,
      ...validatePassword2(password1.value ?? '', value),
    });
  };

  const handleOtpSubmit = () => {
    if (otp.value?.length !== OTP_LEN) {
      setOtp((prev) => ({ ...prev, status: 'error', message: '6자리 인증 번호를 입력해주세요' }));
    }
  };

  const handleSignUpSubmit = () => {
    if (!canSignUp) return;
    signUp({ email: email.value ?? '', password: password1.value ?? '' });
  };

  return (
    <>
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.textFieldContent}>
          <EmailOtpForm
            email={email}
            otp={otp}
            emailRef={emailRef}
            otpRef={otpRef}
            nextFieldRef={password1Ref}
            otpReturnKeyType="done"
            setEmail={setEmail}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            onError={onSignUpError}
          />

          <MDTextField
            ref={password1Ref}
            label="비밀번호"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="next"
            maxLength={PASSWORD_MAX_LEN}
            {...password1}
            onChangeText={handlePassword1Change}
            onSubmitEditing={() => password2Ref.current?.focus()}
          />

          <MDTextField
            ref={password2Ref}
            label="비밀번호 확인"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="done"
            maxLength={PASSWORD_MAX_LEN}
            {...password2}
            onChangeText={handlePassword2Change}
            onSubmitEditing={handleSignUpSubmit}
          />
        </View>
      </ScrollView>

      <MDButton
        style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
        label="가입하기"
        loading={isSignUpPending}
        disabled={!canSignUp}
        onPress={handleSignUpSubmit}
      />
    </>
  );
}

const FormStyles = StyleSheet.create({
  textFieldContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
    gap: 24,
  },
});

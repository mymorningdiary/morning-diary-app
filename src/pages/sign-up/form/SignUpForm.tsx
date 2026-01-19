import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useDupEmail } from '@entities/auth';
import { useToastStore } from '@shared/lib/toast';
import { PASSWORD_MAX_LEN, validateEmail } from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';
import { formatSecondsToMMSS, useCountdown } from '@shared/lib/timer';
import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

const OTP_SEC = 10;

interface Props {
  keyboardSpacing?: number;
  onSignUpSuccess?: (isExistUser: boolean) => void;
  onSignUpError?: (message: string) => void;
}

export function SignUpForm({ keyboardSpacing = 0, onSignUpSuccess, onSignUpError }: Props) {
  const colors = useThemeColor();
  const styles = FormStyles;

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});
  const [password1, setPassword1] = useState<MDFieldState>({});
  const [password2, setPassword2] = useState<MDFieldState>({});

  const [canRequestOtp, setCanRequestOtp] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const { seconds, start, stop, reset } = useCountdown({
    initialSeconds: OTP_SEC,
    onEnd: () => {
      if (otp.status !== 'success') {
        setOtp((prev) => ({ ...prev, status: 'error', message: '인증시간이 만료되었어요' }));
      }
    },
  });

  const requestOtp = () => {
    setShowOtpField(true);
    setOtp({ value: '', status: 'default', message: null });
    reset();
    start();
    setTimeout(() => otpRef.current?.focus(), 0);
  };

  const { checkEmail, isPending } = useDupEmail({
    onSuccess: () => {
      setEmail((prev) => ({ ...prev, status: 'success', message: '사용가능한 이메일이에요' }));
      requestOtp();
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'email': {
          setEmail((prev) => ({ ...prev, status: 'error', message }));
          setCanRequestOtp(false);
          break;
        }
        default: {
          useToastStore.getState().show({ type: 'error', message });
          break;
        }
      }
    },
  });

  const handleEmailChange = (value: string) => {
    const { isValid } = validateEmail(value);
    setCanRequestOtp(isValid);
    setEmail({ value, status: 'default', message: null });
  };

  const handleOtpChange = (value: string) => {
    setOtp({ value, status: 'default', message: null });
  };

  const handlePassword1Change = (value: string) => {
    setPassword1({ value, status: 'default', message: null });
  };

  const handlePassword2Change = (value: string) => {
    setPassword2({ value, status: 'default', message: null });
  };

  const handleRequestOtp = async () => {
    if (email.status !== 'success') {
      await checkEmail({ email: email.value ?? '' });
      return;
    }

    requestOtp();
  };

  // 화면 진입시 포커싱 자동
  useEffect(() => {
    const id = setTimeout(() => {
      emailRef.current?.focus();
    }, 0);

    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.textFieldContent}>
          <MDTextField
            ref={emailRef}
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            editable={email.status !== 'success'}
            {...email}
            onChangeText={handleEmailChange}
            onSubmitEditing={() => otpRef.current?.focus()}
            tail={
              <MDButton
                style={{ minWidth: 76 }}
                size="small"
                label={showOtpField ? '다시 요청' : '인증 요청'}
                loading={isPending}
                disabled={!canRequestOtp}
                onPress={handleRequestOtp}
              />
            }
          />

          {showOtpField && (
            <MDTextField
              ref={otpRef}
              label="인증 번호"
              placeholder="이메일을 확인해주세요"
              returnKeyType="next"
              keyboardType="decimal-pad"
              inputMode="numeric"
              maxLength={6}
              {...otp}
              onChangeText={handleOtpChange}
              onSubmitEditing={() => passwordRef?.current?.focus()}
              tail={
                <MDText type="labelRegular" color={colors.text.alternative}>
                  {formatSecondsToMMSS(seconds)}
                </MDText>
              }
            />
          )}

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="next"
            maxLength={PASSWORD_MAX_LEN}
            {...password1}
            onChangeText={handlePassword1Change}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="done"
            maxLength={PASSWORD_MAX_LEN}
            {...password2}
            onChangeText={handlePassword2Change}
            onSubmitEditing={() => {}}
          />
        </View>
      </ScrollView>

      <MDButton
        style={{ marginHorizontal: 16, marginVertical: keyboardSpacing }}
        label="가입하기"
        loading={false}
        disabled={email.status !== 'success'}
        onPress={() => {}}
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

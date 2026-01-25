import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useState } from 'react';
import { ReturnKeyType, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

import { useCheckEmail, useVerifyOtp } from '@entities/auth';
import { useRequestOtp } from '@entities/mail';
import { useThemeColor } from '@shared/lib/theme';
import { formatSecondsToMMSS, useCountdown } from '@shared/lib/timer';
import { OTP_EXPIRATION_SEC, OTP_LEN, validateEmail } from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  style?: StyleProp<ViewStyle>;
  otpType?: 'SIGN_UP' | 'FIND_PASSWORD';
  email: MDFieldState;
  otp: MDFieldState;
  emailRef?: RefObject<TextInput | null>;
  otpRef?: RefObject<TextInput | null>;
  nextFieldRef?: RefObject<TextInput | null>;
  otpReturnKeyType?: ReturnKeyType;
  setEmail: Dispatch<SetStateAction<MDFieldState>>;
  setOtp: Dispatch<SetStateAction<MDFieldState>>;
  onSubmit?: () => void;
  onError?: (message: string) => void;
}

export function EmailOtpForm({
  style,
  otpType = 'SIGN_UP',
  email,
  otp,
  emailRef,
  otpRef,
  nextFieldRef,
  otpReturnKeyType = 'done',
  setEmail,
  setOtp,
  onSubmit,
  onError,
}: Props) {
  const colors = useThemeColor();
  const styles = FormStyles;

  const [canRequestOtp, setCanRequestOtp] = useState(false);

  const { seconds, isRunning, start, stop, reset } = useCountdown({
    initialSeconds: OTP_EXPIRATION_SEC,
    onEnd: () => {
      if (otp.status !== 'success') {
        setOtp((prev) => ({ ...prev, status: 'error', message: '인증시간이 만료되었어요' }));
      }
    },
  });

  const resetOtp = useCallback(() => {
    setOtp({ value: '', status: 'default', message: null });
    reset();
  }, [setOtp, reset]);

  // 인증번호 요청
  const { requestOtp, isPending: isRequestOtpPending } = useRequestOtp({
    onSuccess: () => {
      if (otpType === 'FIND_PASSWORD' && email.status !== 'success') {
        setEmail((prev) => ({ ...prev, status: 'success' }));
      }
      setTimeout(() => otpRef?.current?.focus(), 0);
      resetOtp();
      start();
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'email': {
          setEmail((prev) => ({ ...prev, status: 'error', message }));
          break;
        }
        default: {
          onError?.(message);
          break;
        }
      }
    },
  });

  // (회원가입시에만) 이메일 중복 검사 (성공시 email.status === 'success'로 만들어 인증 번호 입력 가능하게)
  const { checkEmail, isPending: isCheckEmailPending } = useCheckEmail({
    onSuccess: () => {
      setEmail((prev) => ({ ...prev, status: 'success', message: '사용가능한 이메일이에요' }));
      requestOtp({ type: 'SIGN_UP', email: email.value ?? '' });
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'email': {
          setEmail((prev) => ({ ...prev, status: 'error', message }));
          break;
        }
        default: {
          onError?.(message);
          break;
        }
      }
    },
  });

  // 인증 번호 검증
  const { verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    onSuccess: () => {
      stop();
      setOtp((prev) => ({ ...prev, status: 'success', message: '인증이 완료되었어요' }));
      setTimeout(() => nextFieldRef?.current?.focus(), 0);
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'otp': {
          setOtp((prev) => ({ ...prev, status: 'error', message }));
          break;
        }
        default: {
          onError?.(message);
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

    if (value.length === OTP_LEN && email.status === 'success' && !isVerifyOtpPending) {
      if (isRunning) {
        verifyOtp({ email: email.value ?? '', authenticationNumber: value }); // TODO 디바운싱
      } else {
        setOtp((prev) => ({ ...prev, status: 'error', message: '인증시간이 만료되었어요' }));
      }
    }
  };

  const handleRequestOtp = async () => {
    // 유효하지 않은 이메일 형식에서 submit
    if (!canRequestOtp) {
      const { isValid, message } = validateEmail(email.value);
      if (!isValid) {
        setEmail((prev) => ({ ...prev, status: 'error', message }));
      }
      return;
    }
    const emailValue = email.value ?? '';

    // (회원가입 시에만) 처음 인증 요청시 이메일 검증
    if (otpType === 'SIGN_UP' && email.status !== 'success') {
      await checkEmail({ email: emailValue });
      return;
    }

    // 이메일 검증 후 인증 요청시 인증번호 재요청만
    await requestOtp({ type: otpType, email: emailValue }); // TODO 디바운싱
  };

  // 화면 진입시 포커싱 자동
  useEffect(() => {
    const id = setTimeout(() => {
      emailRef?.current?.focus();
    }, 0);

    return () => clearTimeout(id);
  }, [emailRef]);

  // 회원가입 실패에 따른 에러 핸들링
  useEffect(() => {
    if (email.status === 'error') {
      resetOtp();
      setCanRequestOtp(false);
    }
  }, [email.status, resetOtp]);

  return (
    <View style={[styles.container, style]}>
      <MDTextField
        ref={emailRef}
        label="아이디"
        placeholder="이메일 주소"
        returnKeyType="next"
        keyboardType="email-address"
        editable={email.status !== 'success'}
        {...email}
        onChangeText={handleEmailChange}
        onSubmitEditing={handleRequestOtp}
        tail={
          <MDButton
            style={{ minWidth: 76 }}
            size="small"
            label={
              email.status === 'success'
                ? otp.status === 'success'
                  ? '인증 완료'
                  : '다시 요청'
                : '인증 요청'
            }
            loading={isCheckEmailPending || isRequestOtpPending}
            disabled={!canRequestOtp || otp.status === 'success'}
            onPress={handleRequestOtp}
          />
        }
      />

      {email.status === 'success' && (
        <MDTextField
          ref={otpRef}
          label="인증 번호"
          placeholder="이메일을 확인해주세요"
          returnKeyType={otpReturnKeyType}
          keyboardType="decimal-pad"
          inputMode="numeric"
          maxLength={OTP_LEN}
          editable={otp.status !== 'success'}
          onSubmitEditing={onSubmit}
          {...otp}
          onChangeText={handleOtpChange}
          tail={
            <MDText type="labelRegular" color={colors.text.alternative}>
              {formatSecondsToMMSS(seconds)}
            </MDText>
          }
        />
      )}
    </View>
  );
}

const FormStyles = StyleSheet.create({
  container: {
    gap: 24,
  },
});

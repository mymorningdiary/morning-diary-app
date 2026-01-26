import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  ReturnKeyType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native';

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
  isVerifiedOtp: boolean;
  setEmail: Dispatch<SetStateAction<MDFieldState>>;
  setOtp: Dispatch<SetStateAction<MDFieldState>>;
  setIsVerifiedOtp: Dispatch<SetStateAction<boolean>>;
  setPasswordResetToken?: Dispatch<SetStateAction<string | null>>;
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
  isVerifiedOtp,
  setEmail,
  setOtp,
  setIsVerifiedOtp,
  setPasswordResetToken,
  onError,
}: Props) {
  const colors = useThemeColor();
  const styles = FormStyles;

  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);

  // OTP 카운트다운 타이머
  const { seconds, isRunning, startTimer, stopTimer, resetTimer } = useCountdown({
    initialSeconds: OTP_EXPIRATION_SEC,
    onEnd: () => {
      if (!isVerifiedOtp) {
        setOtp((prev) => ({ ...prev, status: 'error', message: '인증시간이 만료되었어요' }));
      }
    },
  });

  // 인증번호 요청
  const { requestOtp, isPending: isRequestOtpPending } = useRequestOtp({
    onSuccess: () => {
      if (!isVerifiedEmail) {
        setIsVerifiedEmail(true);
      }
      setTimeout(() => otpRef?.current?.focus(), 0);
      setOtp({ value: '', status: 'default', message: null });
      resetTimer();
      startTimer();
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

  // (회원가입시에만) 이메일 중복 검증
  const { checkEmail, isPending: isCheckEmailPending } = useCheckEmail({
    onSuccess: () => {
      setEmail((prev) => ({ ...prev, message: '사용 가능한 이메일이에요' }));
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
    type: otpType,
    onSuccess: (passwordResetToken?: string) => {
      setIsVerifiedOtp(true);
      if (passwordResetToken) {
        setPasswordResetToken?.(passwordResetToken);
      }
      setOtp((prev) => ({ ...prev, status: 'success', message: '인증이 완료되었어요' }));
      stopTimer();
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
    const { isValid, message } = validateEmail({ value });
    setEmail({ value, status: isValid ? 'success' : 'error', message });
  };

  const handleOtpChange = (value: string) => {
    setOtp({ value, status: 'default', message: null });

    if (value.length === OTP_LEN && !isVerifyOtpPending) {
      if (isRunning) {
        verifyOtp({ email: email.value ?? '', authenticationNumber: value }); // TODO 디바운싱
      } else {
        setOtp((prev) => ({ ...prev, status: 'error', message: '인증시간이 만료되었어요' }));
      }
    }
  };

  const handleOtpSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const value = e.nativeEvent.text;

    if (value.length !== OTP_LEN) {
      setOtp((prev) => ({ ...prev, status: 'error', message: '6자리 인증 번호를 입력해주세요' }));
      return;
    }
  };

  const handleRequestOtp = async () => {
    // 유효하지 않은 이메일 형식에서 submit
    if (email.status !== 'success' || isCheckEmailPending || isRequestOtpPending) return;
    const emailValue = email.value ?? '';

    // (회원가입 시에만) 처음 인증 요청시 이메일 검증
    if (otpType === 'SIGN_UP') {
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

  return (
    <View style={[styles.container, style]}>
      <MDTextField
        ref={emailRef}
        label="아이디"
        placeholder="이메일 주소"
        returnKeyType="next"
        keyboardType="email-address"
        editable={!isVerifiedEmail}
        {...email}
        onChangeText={handleEmailChange}
        onSubmitEditing={handleRequestOtp}
        tail={
          <MDButton
            style={{ minWidth: 76 }}
            size="small"
            label={isVerifiedEmail ? (isVerifiedOtp ? '인증 완료' : '다시 요청') : '인증 요청'}
            loading={isCheckEmailPending || isRequestOtpPending}
            disabled={email.status !== 'success' || isVerifiedEmail}
            onPress={handleRequestOtp}
          />
        }
      />

      {isVerifiedEmail && (
        <MDTextField
          ref={otpRef}
          label="인증 번호"
          placeholder="이메일을 확인해주세요"
          returnKeyType={otpReturnKeyType}
          keyboardType="decimal-pad"
          inputMode="numeric"
          maxLength={OTP_LEN}
          editable={!isVerifiedOtp}
          {...otp}
          onChangeText={handleOtpChange}
          onSubmitEditing={handleOtpSubmit}
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

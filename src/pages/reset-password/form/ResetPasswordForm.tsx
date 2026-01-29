import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import { useResetPassword } from '@entities/auth';
import { EmailOtpForm, PasswordForm } from '@features/auth';
import { KEYBOARD_SPACING, useKeyboardVisible } from '@shared/lib/keyboard';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState } from '@shared/ui/TextField';

const EMAIL_OTP_SLIDE_INDEX = 0;
const PASSWORD_SLIDE_INDEX = 1;

interface Props {
  onResetSuccess?: () => void;
  onResetError?: (message: string) => void;
}

export function ResetPasswordForm({ onResetSuccess, onResetError }: Props) {
  const styles = FormStyles;
  const keyboardVisible = useKeyboardVisible();

  const sliderRef = useRef<PagerView | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const password1Ref = useRef<TextInput | null>(null);
  const password2Ref = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});
  const [password1, setPassword1] = useState<MDFieldState>({});
  const [password2, setPassword2] = useState<MDFieldState>({});

  const [currentPosition, setCurrentPosition] = useState(EMAIL_OTP_SLIDE_INDEX);
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);

  const canNext = passwordResetToken !== null;
  const [isVerifiedPassword, setIsVerifiedPassword] = useState(false);

  // 비밀번호 재설정 요청
  const { resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      onResetSuccess?.();
    },
    onError: ({ type, message }) => {
      switch (type) {
        case 'password': {
          setPassword1((prev) => ({ ...prev, status: 'error', message }));
          setTimeout(() => password1Ref.current?.focus(), 0);
          break;
        }
        default: {
          onResetError?.(message);
          break;
        }
      }
    },
  });

  const handleOtpSuccess = ({ passwordResetToken }: { passwordResetToken?: string }) => {
    if (passwordResetToken) {
      setPasswordResetToken(passwordResetToken);
    }
  };

  const handleNextButtonPress = () => {
    if (!canNext) return;
    sliderRef.current?.setPage(PASSWORD_SLIDE_INDEX);
  };

  const handleSubmit = () => {
    if (!isVerifiedPassword || isPending) return;

    resetPassword({
      params: { passwordResetToken: passwordResetToken ?? '' },
      body: { newPassword: password1.value ?? '' },
    });
  };

  useEffect(() => {
    if (currentPosition === EMAIL_OTP_SLIDE_INDEX) {
      setTimeout(() => emailRef?.current?.focus(), 0);
    }
    if (currentPosition === PASSWORD_SLIDE_INDEX) {
      setTimeout(() => password1Ref.current?.focus(), 0);
    }
  }, [currentPosition]);

  return (
    <>
      <PagerView
        ref={sliderRef}
        style={{ flex: 1 }}
        scrollEnabled={false}
        onPageSelected={({ nativeEvent }) => setCurrentPosition(nativeEvent.position)}>
        <View key={`${EMAIL_OTP_SLIDE_INDEX}`} style={styles.textFieldContent}>
          <EmailOtpForm
            otpType="FIND_PASSWORD"
            email={email}
            otp={otp}
            emailRef={emailRef}
            otpRef={otpRef}
            isVerifiedOtp={canNext}
            setEmail={setEmail}
            setOtp={setOtp}
            onSuccess={handleOtpSuccess}
            onError={onResetError}
          />
        </View>
        <View key={`${PASSWORD_SLIDE_INDEX}`} style={styles.textFieldContent}>
          <PasswordForm
            password1={password1}
            password2={password2}
            password1Ref={password1Ref}
            password2Ref={password2Ref}
            setPassword1={setPassword1}
            setPassword2={setPassword2}
            onSuccess={() => setIsVerifiedPassword(true)}
            onError={() => setIsVerifiedPassword(false)}
            onSubmit={handleSubmit}
          />
        </View>
      </PagerView>

      {currentPosition === EMAIL_OTP_SLIDE_INDEX && (
        <MDButton
          style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
          label="다음"
          disabled={!canNext}
          onPress={handleNextButtonPress}
        />
      )}
      {currentPosition === PASSWORD_SLIDE_INDEX && (
        <MDButton
          style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
          label="완료"
          loading={isPending}
          disabled={!isVerifiedPassword}
          onPress={handleSubmit}
        />
      )}
    </>
  );
}

const FormStyles = StyleSheet.create({
  textFieldContent: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});

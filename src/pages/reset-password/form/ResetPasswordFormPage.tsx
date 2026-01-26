import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { EmailOtpForm, PasswordForm } from '@features/auth';
import { KEYBOARD_SPACING, useKeyboardVisible } from '@shared/lib/keyboard';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDFieldState } from '@shared/ui/TextField';
import PagerView from 'react-native-pager-view';

const EMAIL_OTP_PAGE_INDEX = 0;
const PASSWORD_PAGE_INDEX = 1;

export function ResetPasswordPage() {
  const styles = PageStyles;
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

  const [currentPosition, setCurrentPosition] = useState(0);
  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);
  const [isVerifiedPassword, setVerifiedPassword] = useState(false);

  const canNext = isVerifiedOtp || passwordResetToken !== null;

  const handleOtpError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  const handleNextButtonPress = () => {
    if (!canNext) return;
    sliderRef.current?.setPage(1);
  };

  const handleSubmit = () => {};

  useEffect(() => {
    if (currentPosition === EMAIL_OTP_PAGE_INDEX) {
      setTimeout(() => emailRef?.current?.focus(), 0);
    }
    if (currentPosition === PASSWORD_PAGE_INDEX) {
      setTimeout(() => password1Ref.current?.focus(), 0);
    }
  }, [currentPosition]);

  return (
    <MDPage style={[styles.container]}>
      <MDAppBar title="비밀번호 재설정" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PagerView
          ref={sliderRef}
          style={{ flex: 1 }}
          scrollEnabled={false}
          onPageSelected={({ nativeEvent }) => setCurrentPosition(nativeEvent.position)}>
          <View key="email-otp-form" style={styles.textFieldContent}>
            <EmailOtpForm
              otpType="FIND_PASSWORD"
              email={email}
              otp={otp}
              emailRef={emailRef}
              otpRef={otpRef}
              otpReturnKeyType="done"
              isVerifiedOtp={isVerifiedOtp}
              setIsVerifiedOtp={setIsVerifiedOtp}
              setEmail={setEmail}
              setOtp={setOtp}
              setPasswordResetToken={setPasswordResetToken}
              onError={handleOtpError}
            />
          </View>
          <View key="password-form" style={styles.textFieldContent}>
            <PasswordForm
              password1={password1}
              password2={password2}
              password1Ref={password1Ref}
              password2Ref={password2Ref}
              setPassword1={setPassword1}
              setPassword2={setPassword2}
              setVerifiedPassword={setVerifiedPassword}
              onSubmit={handleSubmit}
            />
          </View>
        </PagerView>

        {currentPosition === EMAIL_OTP_PAGE_INDEX && (
          <MDButton
            style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
            label="다음"
            disabled={!canNext}
            onPress={handleNextButtonPress}
          />
        )}
        {currentPosition === PASSWORD_PAGE_INDEX && (
          <MDButton
            style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
            label="완료"
            loading={false}
            disabled={!isVerifiedPassword}
            onPress={handleSubmit}
          />
        )}
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  textFieldContent: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
});

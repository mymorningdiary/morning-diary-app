import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { EmailOtpForm } from '@features/auth';
import { useToastStore } from '@shared/lib/toast';
import { OTP_LEN } from '@shared/lib/validation/otp';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDFieldState } from '@shared/ui/TextField';
import { useKeyboardVisible, KEYBOARD_SPACING } from '@shared/lib/keyboard';

export function ResetPasswordPage() {
  const styles = PageStyles;
  const keyboardVisible = useKeyboardVisible();

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});

  const canNext = otp.status === 'success';

  const handleOtpSubmit = () => {
    if (otp.value?.length !== OTP_LEN) {
      setOtp((prev) => ({ ...prev, status: 'error', message: '6자리 인증 번호를 입력해주세요' }));
    }
  };

  const onOtpError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  const handleNextButtonPress = () => {};

  return (
    <MDPage style={[styles.container]}>
      <MDAppBar title="비밀번호 재설정" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.textFieldContent}>
            <EmailOtpForm
              otpType="FIND_PASSWORD"
              email={email}
              otp={otp}
              emailRef={emailRef}
              otpRef={otpRef}
              otpReturnKeyType="done"
              setEmail={setEmail}
              setOtp={setOtp}
              onSubmit={handleOtpSubmit}
              onError={onOtpError}
            />
          </View>
        </ScrollView>

        <MDButton
          style={{ marginHorizontal: 16, marginVertical: keyboardVisible ? KEYBOARD_SPACING : 0 }}
          label="다음"
          loading={false}
          disabled={!canNext}
          onPress={handleNextButtonPress}
        />
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  textFieldContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
    gap: 24,
  },
});

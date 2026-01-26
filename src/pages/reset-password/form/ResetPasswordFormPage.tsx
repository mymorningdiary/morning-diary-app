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
import { KEYBOARD_SPACING, useKeyboardVisible } from '@shared/lib/keyboard';
import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDFieldState } from '@shared/ui/TextField';

export function ResetPasswordPage() {
  const styles = PageStyles;
  const keyboardVisible = useKeyboardVisible();

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});

  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);

  const canNext = otp.status === 'success';

  const handleOtpError = (message: string) => {
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
              isVerifiedOtp={isVerifiedOtp}
              setIsVerifiedOtp={setIsVerifiedOtp}
              setEmail={setEmail}
              setOtp={setOtp}
              onError={handleOtpError}
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

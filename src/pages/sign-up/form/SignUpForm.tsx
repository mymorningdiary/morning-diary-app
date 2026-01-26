import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useSignUp } from '@entities/auth';
import { EmailOtpForm, PasswordForm } from '@features/auth';
import { KEYBOARD_SPACING, useKeyboardVisible } from '@shared/lib/keyboard';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState } from '@shared/ui/TextField';

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

  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);
  const [isVerifiedPassword, setVerifiedPassword] = useState(false);

  const canSignUp = isVerifiedOtp && isVerifiedPassword;

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

  const handleSignUpSubmit = () => {
    if (!canSignUp || isSignUpPending) return;
    signUp({ email: email.value ?? '', password: password1.value ?? '' });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      emailRef?.current?.focus();
    }, 0);

    return () => clearTimeout(id);
  }, [emailRef]);

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
            isVerifiedOtp={isVerifiedOtp}
            setEmail={setEmail}
            setOtp={setOtp}
            setIsVerifiedOtp={setIsVerifiedOtp}
            onError={onSignUpError}
          />

          <PasswordForm
            password1={password1}
            password2={password2}
            password1Ref={password1Ref}
            password2Ref={password2Ref}
            setPassword1={setPassword1}
            setPassword2={setPassword2}
            setVerifiedPassword={setVerifiedPassword}
            onSubmit={handleSignUpSubmit}
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
    gap: 24,
    paddingBottom: 60,
  },
});

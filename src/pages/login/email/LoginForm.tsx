import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useLoginEmail } from '@features/login';
import { useThemeColor } from '@shared/lib/theme';
import { PASSWORD_MAX_LEN, validateEmail, validatePassword } from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  bottomSpacing?: number;
  onGoSignUp?: () => void;
  onGoResetPassword?: () => void;
  onLoginSuccess?: (isExistUser: boolean) => void;
  onLoginError?: (message: string) => void;
}

export function LoginForm({
  bottomSpacing = 0,
  onGoSignUp,
  onGoResetPassword,
  onLoginSuccess,
  onLoginError,
}: Props) {
  const colors = useThemeColor();
  const styles = FormStyles;

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [password, setPassword] = useState<MDFieldState>({});

  const { loginEmail, isPending } = useLoginEmail({
    onSuccess: onLoginSuccess,
    onError: ({ type, message }) => {
      if (type === 'email') {
        setEmail((prev) => ({ ...prev, status: 'error', message }));
        emailRef.current?.focus();
        return;
      }
      if (type === 'password') {
        setPassword((prev) => ({ ...prev, status: 'error', message }));
        passwordRef.current?.focus();
        return;
      }
      onLoginError?.(message);
    },
  });

  const handleEmailChange = (value: string) => {
    setEmail({ value, status: 'default', message: null });
  };

  const handlePasswordChange = (value: string) => {
    setPassword({ value, status: 'default', message: null });
  };

  const handleSubmit = async () => {
    const emailValue = email.value ?? '';
    const passwordValue = password.value ?? '';

    const emailValidation = validateEmail(emailValue);
    const passwordValidation = validatePassword(passwordValue);

    setEmail((prev) => ({
      ...prev,
      status: emailValidation.isValid ? 'success' : 'error',
      message: emailValidation.message,
    }));

    setPassword((prev) => ({
      ...prev,
      status: passwordValidation.isValid ? 'success' : 'error',
      message: passwordValidation.message,
    }));

    if (!emailValidation.isValid) {
      emailRef.current?.focus();
      return;
    }

    if (!passwordValidation.isValid) {
      passwordRef.current?.focus();
      return;
    }

    loginEmail({ email: emailValue, password: passwordValue });
  };

  return (
    <>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.textFieldContent}>
          <MDTextField
            ref={emailRef}
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            {...email}
            onChangeText={handleEmailChange}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="비밀번호"
            secureTextEntry
            returnKeyType="done"
            maxLength={PASSWORD_MAX_LEN}
            {...password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </ScrollView>

      <View style={[styles.buttonContent, { paddingBottom: bottomSpacing }]}>
        <MDButton label="로그인" loading={isPending} onPress={handleSubmit} />
        <MDButton variant="outline" label="회원가입" onPress={onGoSignUp} />

        <Pressable hitSlop={10} onPress={onGoResetPassword}>
          <MDText type="labelRegular" color={colors.text.alternative}>
            비밀번호 재설정
          </MDText>
        </Pressable>
      </View>
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
  buttonContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
});

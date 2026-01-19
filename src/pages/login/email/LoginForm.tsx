import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useLoginEmail } from '@features/login';
import { PASSWORD_MAX_LEN, validateEmail, validatePassword } from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  keyboardSpacing?: number;
  onLoginSuccess?: (isExistUser: boolean) => void;
  onLoginError?: (message: string) => void;
}

export function LoginForm({ keyboardSpacing = 0, onLoginSuccess, onLoginError }: Props) {
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

  // 폼 유효성 검사
  const validateForm = () => {
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
      return null;
    }

    if (!passwordValidation.isValid) {
      passwordRef.current?.focus();
      return null;
    }

    return { email: emailValue, password: passwordValue };
  };

  // 로그인 요청
  const handleSubmit = () => {
    const form = validateForm();
    if (form) {
      loginEmail({ email: form.email, password: form.password });
    }
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

      <MDButton
        style={{ marginHorizontal: 16, marginVertical: keyboardSpacing }}
        label="로그인"
        loading={isPending}
        onPress={handleSubmit}
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
